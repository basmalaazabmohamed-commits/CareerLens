
import json
import re
from pathlib import Path

import pandas as pd
from retrieval.job_lookup import get_job_record
from ingestion.cv_parser import extract_cv_text
from ingestion.cv_cleaning import clean_cv_text

from candidate_profile.skill_extraction import extract_candidate_profile
from candidate_profile.skill_normalization import normalize_skills
from candidate_profile.job_requirements_extractor import (
    extract_job_requirements,
)
from candidate_profile.skill_gap import analyze_skill_gap

from retrieval.hybrid_search import HybridRetriever
from retrieval.reranker import Reranker


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_CV_DIR = PROJECT_ROOT / "data" / "raw" / "cvs"
PROCESSED_CV_DIR = PROJECT_ROOT / "data" / "processed" / "cvs"


# Keep the first integration test small to reduce Gemini API usage.
DEFAULT_RETRIEVAL_K = 50
DEFAULT_RERANK_K = 20
DEFAULT_MAX_JOBS = 2


def make_candidate_id(file_path: Path) -> str:
    name = re.sub(r"[^a-zA-Z0-9_-]+", "_", file_path.stem)
    name = name.strip("_")

    if not name:
        raise ValueError("Could not create a candidate ID.")

    return name


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def build_candidate_profile(file_path: str | Path):
    """Parse a CV, extract its profile, normalize skills, and save artifacts."""
    path = Path(file_path)

    if not path.is_absolute():
        path = PROJECT_ROOT / path

    path = path.resolve()

    if not path.is_file():
        raise FileNotFoundError(f"CV not found: {path}")

    candidate_id = make_candidate_id(path)

    raw_text = extract_cv_text(path)
    cleaned_text = clean_cv_text(raw_text)

    if not cleaned_text.strip():
        raise ValueError(
            "The CV contains no extractable text. "
            "If it is a scanned PDF, OCR may be required."
        )

    profile = extract_candidate_profile(
        cv_text=cleaned_text,
        candidate_id=candidate_id,
    )

    # Combine candidate skills and project technologies into one request.
    # This reduces Gemini calls while preserving the original grouping.
    original_skill_count = len(profile.skills)
    project_skill_counts = [
        len(project.technologies)
        for project in profile.projects
    ]

    all_skills = list(profile.skills)

    for project in profile.projects:
        all_skills.extend(project.technologies)

    if all_skills:
        normalized_skills = normalize_skills(all_skills)

        # Protect against a normalization response that changes the number
        # of skills: the returned list must match the input list.
        if len(normalized_skills) != len(all_skills):
            raise ValueError(
                "Skill normalization returned a different number of items "
                f"(input={len(all_skills)}, "
                f"output={len(normalized_skills)}). "
                "Check skill_normalization.py before continuing."
            )

        profile.skills = normalized_skills[:original_skill_count]

        offset = original_skill_count

        for project, technology_count in zip(
            profile.projects,
            project_skill_counts,
        ):
            project.technologies = normalized_skills[
                offset:offset + technology_count
            ]
            offset += technology_count

    PROCESSED_CV_DIR.mkdir(parents=True, exist_ok=True)

    (PROCESSED_CV_DIR / f"{candidate_id}.txt").write_text(
        cleaned_text,
        encoding="utf-8",
    )

    save_json(
        PROCESSED_CV_DIR / f"{candidate_id}.json",
        profile.model_dump(),
    )

    return profile


def _find_text_column(results: pd.DataFrame) -> str:
    for column in ("text", "chunk_text", "content", "chunk"):
        if column in results.columns:
            return column

    raise ValueError(
        "No recognized chunk text column found. "
        f"Available columns: {results.columns.tolist()}"
    )


def _build_candidate_query(profile) -> str:
    skill_names = [skill.name for skill in profile.skills]

    parts = [
        "Find suitable job postings for this candidate.",
        "Candidate skills: " + ", ".join(skill_names),
    ]

    for project in profile.projects:
        if project.name or project.description:
            parts.append(
                f"Project: {project.name}. {project.description}"
            )

        technology_names = [
            technology.name for technology in project.technologies
        ]

        if technology_names:
            parts.append(
                "Project technologies: " + ", ".join(technology_names)
            )

    for experience in profile.experience:
        if experience.role or experience.description:
            parts.append(
                f"Experience: {experience.role}. "
                f"{experience.description}"
            )

    for education in profile.education:
        if education.degree or education.field_of_study:
            parts.append(
                f"Education: {education.degree}, "
                f"{education.field_of_study}"
            )

    return "\n".join(parts)[:8000]


def retrieve_and_analyze_jobs(
    profile,
    retrieval_k: int = DEFAULT_RETRIEVAL_K,
    rerank_k: int = DEFAULT_RERANK_K,
    max_jobs: int = DEFAULT_MAX_JOBS,
) -> dict:
    """Retrieve, rerank, and analyze a limited number of unique jobs."""

    query = _build_candidate_query(profile)

    if not query.strip():
        raise ValueError("Candidate profile has no searchable information.")

    hybrid = HybridRetriever()
    candidates = hybrid.search(
        query=query,
        top_k=retrieval_k,
        retrieval_k=retrieval_k,
    )

    if candidates is None or candidates.empty:
        return {
            "candidate_id": profile.candidate_id,
            "matched_jobs": [],
            "message": "No job chunks were retrieved.",
        }

    reranker = Reranker()
    ranked = reranker.rerank(
        query=query,
        results=candidates,
        top_k=rerank_k,
    )

    if ranked is None or ranked.empty:
        return {
            "candidate_id": profile.candidate_id,
            "matched_jobs": [],
            "message": "No results remained after reranking.",
        }

    if "job_id" not in ranked.columns:
        raise ValueError(
            "Retrieval results must contain job_id. "
            f"Columns: {ranked.columns.tolist()}"
        )

    text_column = _find_text_column(ranked)

    # Multiple chunks can belong to the same job.
    # Group them to avoid duplicate job recommendations.
    job_groups = []

    for job_id, group in ranked.groupby("job_id", sort=False):
        if pd.isna(job_id):
            continue

        first = group.iloc[0]
        chunks = []

        for _, row in group.head(3).iterrows():
            chunk_text = str(row.get(text_column, "")).strip()

            if chunk_text:
                chunks.append(chunk_text)

        combined_text = "\n\n".join(dict.fromkeys(chunks))

        if not combined_text:
            continue

        
        # Prefer the original processed job over retrieved chunks.
        # This makes requirement extraction more complete and stable.
        original_job = get_job_record(job_id)

        if original_job and original_job["job_text"].strip():
            job_title = (
                original_job["title"]
                or str(first.get("title", ""))
            )
            company_name = (
                original_job["company_name"]
                or str(first.get("company_name", ""))
            )
            job_text = original_job["job_text"]
            source = "processed_job"
        else:
            # Fallback when the job_id is not present in the dataset.
            job_title = str(first.get("title", ""))
            company_name = str(first.get("company_name", ""))
            job_text = combined_text
            source = "retrieved_chunks"

        job_groups.append({
            "job_id": str(job_id),
            "title": job_title,
            "company_name": company_name,
            "retrieval_score": (
                float(first["reranker_score"])
                if "reranker_score" in first.index
                and pd.notna(first["reranker_score"])
                else None
            ),
            "job_text": job_text,
            "job_text_source": source,
        })

        if len(job_groups) >= max_jobs:
            break

    analyzed_jobs = []

    for item in job_groups:
        requirements = extract_job_requirements(
            job_id=item["job_id"],
            title=item["title"],
            company_name=item["company_name"],
            job_text=item["job_text"],
        )

        gap = analyze_skill_gap(profile, requirements)

        analyzed_jobs.append({
            **gap,
            "retrieval_score": item["retrieval_score"],
            "job_requirements": requirements.model_dump(),
        })

    return {
        "candidate_id": profile.candidate_id,
        "matched_jobs": analyzed_jobs,
        "message": (
            "Results are based on retrieved job chunks. "
            "They may not contain the complete original job posting."
        ),
    }


def run_cv_pipeline(
    file_path: str | Path,
    retrieval_k: int = DEFAULT_RETRIEVAL_K,
    rerank_k: int = DEFAULT_RERANK_K,
    max_jobs: int = DEFAULT_MAX_JOBS,
) -> dict:
    """Run the end-to-end CV-to-job matching pipeline."""

    profile = build_candidate_profile(file_path)

    if (
        not profile.skills
        and not profile.projects
        and not profile.experience
    ):
        raise ValueError(
            "The CV did not provide enough searchable career information."
        )

    report = retrieve_and_analyze_jobs(
        profile,
        retrieval_k=retrieval_k,
        rerank_k=rerank_k,
        max_jobs=max_jobs,
    )

    output_path = (
        PROCESSED_CV_DIR
        / f"{profile.candidate_id}_job_analysis.json"
    )

    save_json(output_path, report)

    print(f"Candidate profile: {profile.candidate_id}")
    print(f"Report saved to: {output_path}")
    print(f"Jobs analyzed: {len(report['matched_jobs'])}")

    return report
