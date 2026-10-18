
from functools import lru_cache

import pandas as pd
from pydantic import BaseModel, Field

from candidate_profile.gemini_client import generate_structured
from generation.prompts import build_career_prompt
from retrieval.hybrid_search import HybridRetriever
from retrieval.reranker import Reranker


class CareerAnswer(BaseModel):
    answer: str
    cited_job_ids: list[str] = Field(default_factory=list)
    follow_up_questions: list[str] = Field(default_factory=list)


@lru_cache(maxsize=1)
def _get_hybrid_retriever():
    # Reuse the retriever within this Python process.
    return HybridRetriever()


@lru_cache(maxsize=1)
def _get_reranker():
    # Load the cross-encoder once per process.
    return Reranker()


def _get_text_column(results: pd.DataFrame) -> str:
    for column in ("text", "chunk_text", "content", "chunk"):
        if column in results.columns:
            return column

    raise ValueError(
        "No recognized chunk text column found. "
        f"Available columns: {results.columns.tolist()}"
    )


def _candidate_summary(profile) -> str:
    if profile is None:
        return ""

    skills = [
        skill.name for skill in profile.skills
    ]

    projects = [
        f"{project.name}: {project.description}"
        for project in profile.projects
        if project.name or project.description
    ]

    experience = [
        f"{item.role}: {item.description}"
        for item in profile.experience
        if item.role or item.description
    ]

    return (
        "Skills: " + ", ".join(skills[:30])
        + "\nProjects: " + "\n".join(projects[:5])
        + "\nExperience: " + "\n".join(experience[:5])
    )[:5000]


def _make_search_query(query: str, profile) -> str:
    if profile is None:
        return query

    # Add candidate skills when the user is asking for matching or
    # career-fit advice. Keep general job questions focused on the question.
    match_terms = (
        "match", "matching", "suitable", "suitability", "fit",
        "my cv", "my skills", "skill gap", "my profile",
        "مناسب", "مهاراتي", "سيرتي الذاتية", "الفجوة",
        "وظائف تناسب", "قارن",
    )

    if not any(term in query.lower() for term in match_terms):
        return query

    skills = [skill.name for skill in profile.skills[:30]]

    if not skills:
        return query

    return (
        query
        + "\nCandidate skills: "
        + ", ".join(skills)
    )[:8000]


def _format_history(history: list[dict] | None) -> str:
    if not history:
        return ""

    lines = []

    # Keep the latest turns to avoid unnecessarily large prompts.
    for message in history[-6:]:
        role = str(message.get("role", "user")).lower()

        if role not in {"user", "assistant"}:
            continue

        content = str(message.get("content", "")).strip()

        if content:
            lines.append(f"{role}: {content[:1500]}")

    return "\n".join(lines)


def _build_job_context(
    ranked: pd.DataFrame,
    max_jobs: int = 5,
    chunks_per_job: int = 2,
) -> tuple[str, list[dict]]:
    if ranked.empty:
        return "", []

    if "job_id" not in ranked.columns:
        raise ValueError("Reranker results must contain job_id.")

    text_column = _get_text_column(ranked)

    sections = []
    sources = []
    seen_jobs = set()

    for _, row in ranked.iterrows():
        raw_job_id = row.get("job_id")

        if pd.isna(raw_job_id):
            continue

        job_id = str(raw_job_id)

        if job_id in seen_jobs:
            # Allow more chunks from jobs already selected.
            pass
        elif len(seen_jobs) >= max_jobs:
            continue
        else:
            seen_jobs.add(job_id)
            sources.append({
                "job_id": job_id,
                "title": str(row.get("title", "")),
                "company_name": str(row.get("company_name", "")),
            })

        # Limit how many chunks from a single job are included.
        if sum(
            1 for section in sections
            if section.startswith(f"JOB ID: {job_id}\n")
        ) >= chunks_per_job:
            continue

        chunk_text = str(row.get(text_column, "")).strip()

        if not chunk_text:
            continue

        title = str(row.get("title", ""))
        company = str(row.get("company_name", ""))
        section = str(row.get("section", ""))

        sections.append(
            f"JOB ID: {job_id}\n"
            f"TITLE: {title}\n"
            f"COMPANY: {company}\n"
            f"SECTION: {section}\n"
            f"JOB TEXT:\n{chunk_text[:3000]}"
        )

    return "\n\n---\n\n".join(sections)[:15000], sources


def answer_user_query(
    query: str,
    candidate_profile=None,
    history: list[dict] | None = None,
    retrieval_k: int = 30,
    rerank_k: int = 10,
    max_jobs: int = 5,
) -> dict:
    """Retrieve job evidence and generate a grounded conversational answer."""

    query = query.strip()

    if not query:
        raise ValueError("The user query cannot be empty.")

    search_query = _make_search_query(query, candidate_profile)

    hybrid = _get_hybrid_retriever()
    candidates = hybrid.search(
        query=search_query,
        top_k=retrieval_k,
        retrieval_k=retrieval_k,
    )

    if candidates is None or candidates.empty:
        return {
            "answer": (
                "I couldn't find relevant job evidence for this question. "
                "Try different keywords or ask about a specific role."
            ),
            "citations": [],
            "follow_up_questions": [
                "Which job title are you interested in?",
                "Would you like to search by a particular skill?",
            ],
            "retrieved_job_count": 0,
        }

    reranker = _get_reranker()
    ranked = reranker.rerank(
        query=search_query,
        results=candidates,
        top_k=rerank_k,
    )

    if ranked is None or ranked.empty:
        return {
            "answer": "No relevant job results remained after reranking.",
            "citations": [],
            "follow_up_questions": [],
            "retrieved_job_count": 0,
        }

    context, sources = _build_job_context(
        ranked,
        max_jobs=max_jobs,
        chunks_per_job=2,
    )

    if not context.strip():
        return {
            "answer": "I couldn't retrieve readable job descriptions.",
            "citations": [],
            "follow_up_questions": [],
            "retrieved_job_count": 0,
        }

    prompt = build_career_prompt(
        query=query,
        context=context,
        candidate_context=_candidate_summary(candidate_profile),
        history=_format_history(history),
    )

    # Identical prompt/schema/model requests can reuse the local cache.
    generated = generate_structured(prompt, CareerAnswer)

    valid_ids = {source["job_id"] for source in sources}
    cited_ids = list(dict.fromkeys(
        str(job_id)
        for job_id in generated.cited_job_ids
        if str(job_id) in valid_ids
    ))

    citations = [
        source for source in sources
        if source["job_id"] in cited_ids
    ]

    return {
        "answer": generated.answer,
        "citations": citations,
        "follow_up_questions": generated.follow_up_questions[:3],
        "retrieved_job_count": len(sources),
    }
