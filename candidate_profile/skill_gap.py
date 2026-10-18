
import re

from candidate_profile.candidate_profile import CandidateProfile
from candidate_profile.job_requirements_extractor import JobRequirements


_ALIAS_GROUPS = [
    {"sklearn", "scikit learn", "scikit-learn"},
    {"js", "javascript"},
    {"ts", "typescript"},
    {"tf", "tensorflow"},
    {"pytorch", "torch"},
    {
        "nlp",
        "natural language processing",
        "natural language processing nlp",
    },
    {"cv", "computer vision", "computer vision cv"},
    {"mlops", "machine learning operations"},
    {"llm", "large language model", "large language model llm"},
    {"llms", "large language models", "large language models llms"},
    {"genai", "generative ai", "generative artificial intelligence"},
    {"api", "application programming interface"},
    {"apis", "application programming interfaces"},
]

_ALIAS_LOOKUP = {
    alias: group
    for group in _ALIAS_GROUPS
    for alias in group
}


def _skill_key(name: str) -> str:
    """Normalize superficial formatting differences."""
    name = (name or "").casefold().strip()
    name = name.replace("&", " and ")
    name = re.sub(r"[-_./]+", " ", name)
    name = re.sub(r"[^\w+# ]+", "", name)
    return " ".join(name.split())


def _evidence_text(value) -> str:
    """Normalize whitespace in evidence values."""
    if value is None:
        return ""
    return " ".join(str(value).split())


def _is_project_title_only(skill_name: str, evidence: str) -> bool:
    """Detect project-title fragments without discarding descriptive evidence."""
    skill_key = _skill_key(skill_name)
    evidence_key = _skill_key(evidence)

    if not skill_key or not evidence_key:
        return False

    # A fragment containing only the skill name is not descriptive evidence.
    if evidence_key == skill_key:
        return True

    words = evidence_key.split()
    has_title_separator = bool(re.search(r"\s[–—:]\s", evidence))
    has_title_marker = any(
        marker in evidence_key
        for marker in ("project", "report generation", "system")
    )
    contains_skill = skill_key in evidence_key
    has_technology_list = "," in evidence

    return (
        has_title_separator
        and has_title_marker
        and contains_skill
        and (len(words) <= 12 or has_technology_list)
    ) or (
        len(words) <= 7
        and has_title_marker
        and contains_skill
    )


def _clean_evidence_for_skill(skill_name: str, evidence: str) -> str:
    """
    Remove title-only fragments while preserving descriptive evidence.

    Evidence fragments are separated by ' | '. This function cleans
    evidence for display and matching; it does not verify skill proficiency.
    """
    cleaned_parts = []
    seen = set()

    for part in _evidence_text(evidence).split(" | "):
        part = _evidence_text(part)

        if not part:
            continue

        if _is_project_title_only(skill_name, part):
            continue

        key = part.casefold()
        if key not in seen:
            seen.add(key)
            cleaned_parts.append(part)

    return " | ".join(cleaned_parts)


def _merge_evidence(*values: str) -> str:
    """Merge evidence fragments without repeating identical text."""
    parts = []
    seen = set()

    for value in values:
        for part in _evidence_text(value).split(" | "):
            part = _evidence_text(part)
            key = part.casefold()

            if part and key not in seen:
                seen.add(key)
                parts.append(part)

    return " | ".join(parts)


def _same_skill(candidate_name: str, requirement_name: str) -> bool:
    """Check exact normalized names or explicitly configured aliases."""
    candidate_key = _skill_key(candidate_name)
    requirement_key = _skill_key(requirement_name)

    if not candidate_key or not requirement_key:
        return False

    if candidate_key == requirement_key:
        return True

    candidate_aliases = _ALIAS_LOOKUP.get(
        candidate_key, {candidate_key}
    )
    requirement_aliases = _ALIAS_LOOKUP.get(
        requirement_key, {requirement_key}
    )

    return bool(candidate_aliases.intersection(requirement_aliases))


_EVIDENCE_PATTERNS = {
    "model deployment": [
        r"\bdeploy(?:ed|ing|ment)?\b.{0,100}\bmodel\b",
        r"\bmodel\b.{0,100}\bdeploy(?:ed|ing|ment)?\b",
        r"\bserv(?:e|ed|ing|es)\b.{0,80}\bmodel\b.{0,80}\bapi\b",
        r"\bfastapi\b.{0,100}\bdeploy(?:ed|ing|ment)?\b",
        r"\bdeploy(?:ed|ing|ment)?\b.{0,100}\bfastapi\b",
    ],
    "api development": [
        r"\bdevelop(?:ed|ing|ment)?\b.{0,80}\bapi\b",
        r"\bapi\b.{0,80}\bdevelop(?:ed|ing|ment)?\b",
        r"\bfastapi\b",
        r"\bflask\b",
    ],
    "model fine-tuning": [
        r"\bfine[\s-]?tun(?:e|ed|ing)\b",
    ],
    "experiment tracking": [
        r"\bmlflow\b",
        r"\bexperiment tracking\b",
        r"\btrack(?:ed|ing)? experiments\b",
    ],
    "model monitoring": [
        r"\bmodel monitoring\b",
        r"\bmonitor(?:ed|ing)? model performance\b",
        r"\bmonitor(?:ed|ing)? model drift\b",
    ],
}


def _evidence_supports_requirement(
    requirement_name: str,
    candidate_skill_name: str,
    candidate_evidence: str,
) -> bool:
    """Match configured concepts only when descriptive evidence supports them."""
    requirement_key = _skill_key(requirement_name)
    evidence = _clean_evidence_for_skill(
        candidate_skill_name, candidate_evidence
    ).casefold()

    if not evidence:
        return False

    for concept, patterns in _EVIDENCE_PATTERNS.items():
        if requirement_key == _skill_key(concept):
            return any(
                re.search(pattern, evidence, flags=re.IGNORECASE)
                for pattern in patterns
            )

    return False


def analyze_skill_gap(
    candidate: CandidateProfile,
    job: JobRequirements,
) -> dict:
    """Compare job requirements against candidate skills and evidence."""

    candidate_skills = {}
    candidate_skill_sources = list(candidate.skills)

    # Include project technologies and their project descriptions.
    # Project titles alone must not be treated as evidence of tasks performed.
    for project in candidate.projects:
        project_description = _evidence_text(project.description)

        for technology in project.technologies:
            combined_evidence = _merge_evidence(
                technology.evidence,
                project_description,
            )

            technology_evidence = _clean_evidence_for_skill(
                technology.name,
                combined_evidence,
            )

            candidate_skill_sources.append(
                technology.model_copy(
                    update={
                        "evidence": technology_evidence,
                        "source_section": "Projects",
                    }
                )
            )

    # Deduplicate skill names while preserving distinct evidence.
    for skill in candidate_skill_sources:
        name = _evidence_text(skill.name)
        if not name:
            continue

        key = _skill_key(name)
        if not key:
            continue

        cleaned_evidence = _clean_evidence_for_skill(
            name, skill.evidence
        )

        existing = candidate_skills.get(key)

        if existing is None:
            candidate_skills[key] = skill.model_copy(
                update={"evidence": cleaned_evidence}
            )
            continue

        merged_evidence = _merge_evidence(
            existing.evidence,
            cleaned_evidence,
        )
        merged_evidence = _clean_evidence_for_skill(
            name, merged_evidence
        )

        candidate_skills[key] = existing.model_copy(
            update={"evidence": merged_evidence}
        )

    matched_required = []
    required_not_found = []
    matched_preferred = []
    preferred_not_found = []

    def compare_requirements(requirements, matched, not_found):
        seen = set()

        for requirement in requirements:
            name = _evidence_text(requirement.name)
            if not name:
                continue

            key = _skill_key(name)
            if not key or key in seen:
                continue
            seen.add(key)

            # Explicit skill names and configured aliases take priority.
            candidate_skill = next(
                (
                    skill
                    for skill in candidate_skills.values()
                    if _same_skill(skill.name, name)
                ),
                None,
            )

            if candidate_skill is not None:
                status = (
                    "matched_by_name"
                    if _skill_key(candidate_skill.name) == key
                    else "matched_by_alias"
                )

                matched.append({
                    "skill": name,
                    "status": status,
                    "candidate_evidence": _clean_evidence_for_skill(
                        candidate_skill.name,
                        candidate_skill.evidence,
                    ),
                    "job_evidence": _evidence_text(
                        requirement.evidence
                    ),
                })
                continue

            # Broader requirements can match only through configured,
            # descriptive evidence patterns.
            evidence_match = next(
                (
                    skill
                    for skill in candidate_skills.values()
                    if _evidence_supports_requirement(
                        requirement_name=name,
                        candidate_skill_name=skill.name,
                        candidate_evidence=skill.evidence,
                    )
                ),
                None,
            )

            if evidence_match is not None:
                matched.append({
                    "skill": name,
                    "status": "matched_by_evidence",
                    "candidate_evidence": _clean_evidence_for_skill(
                        evidence_match.name,
                        evidence_match.evidence,
                    ),
                    "job_evidence": _evidence_text(
                        requirement.evidence
                    ),
                })
            else:
                not_found.append({
                    "skill": name,
                    "status": "not_found_in_cv",
                    "candidate_evidence": "",
                    "job_evidence": _evidence_text(
                        requirement.evidence
                    ),
                })

    compare_requirements(
        job.required_skills,
        matched_required,
        required_not_found,
    )
    compare_requirements(
        job.preferred_skills,
        matched_preferred,
        preferred_not_found,
    )

    total_required = len(matched_required) + len(required_not_found)
    total_preferred = len(matched_preferred) + len(preferred_not_found)

    required_skill_coverage = (
        len(matched_required) / total_required
        if total_required
        else None
    )
    preferred_skill_coverage = (
        len(matched_preferred) / total_preferred
        if total_preferred
        else None
    )

    return {
        "candidate_id": candidate.candidate_id,
        "job_id": job.job_id,
        "title": job.title,
        "company_name": job.company_name,
        "matched_required_skills": matched_required,
        "required_skills_not_found_in_cv": required_not_found,
        "matched_preferred_skills": matched_preferred,
        "preferred_skills_not_found_in_cv": preferred_not_found,
        "required_skill_count": total_required,
        "matched_required_skill_count": len(matched_required),
        "required_skills_not_found_count": len(required_not_found),
        "preferred_skill_count": total_preferred,
        "matched_preferred_skill_count": len(matched_preferred),
        "preferred_skills_not_found_count": len(preferred_not_found),
        "required_skill_coverage": required_skill_coverage,
        "preferred_skill_coverage": preferred_skill_coverage,
        "coverage_note": (
            "Coverage measures exact-name, configured-alias, and "
            "limited evidence-based matches among extracted requirements. "
            "It is not a probability of getting hired. A skill not found "
            "in the CV is not proof that the candidate does not have it. "
            "Evidence-based matches should be reviewed when the requirement "
            "is broader than the evidence."
        ),
    }
