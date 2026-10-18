
from typing import Literal

QueryRoute = Literal[
    "custom_job_gap",
    "candidate_job_search",
    "general_job_search",
]


def route_query(
    query: str,
    candidate_id: str | None = None,
    job_description: str | None = None,
) -> dict:
    """
    Route a user request to the appropriate CareerRAG workflow.
    """

    text = (query or "").strip().lower()
    description = (job_description or "").strip()

    # An explicitly supplied job description takes priority.
    if description:
        return {
            "route": "custom_job_gap",
            "reason": "A custom job description was supplied.",
        }

    # Also support pasting a job description inside the query.
    markers = (
        "job description:",
        "job description\n",
        "job description -",
    )

    if any(marker in text for marker in markers):
        return {
            "route": "custom_job_gap",
            "reason": "A job description marker was found in the query.",
        }

    candidate_terms = (
        "my cv",
        "my resume",
        "my skills",
        "skill gap",
        "match my profile",
        "compare my cv",
        "مهاراتي",
        "سيرتي الذاتية",
        "الفجوة المهارية",
        "قارن مهاراتي",
        "وظائف تناسبني",
    )

    if candidate_id and any(term in text for term in candidate_terms):
        return {
            "route": "candidate_job_search",
            "reason": "The question asks for candidate-specific job matching.",
        }

    return {
        "route": "general_job_search",
        "reason": "The question is a general job search or career question.",
    }


def extract_inline_job_description(query: str) -> str | None:
    text = (query or "").strip()

    markers = (
        "job description:",
        "job description\n",
        "job description -",
    )

    lowered = text.lower()

    for marker in markers:
        position = lowered.find(marker)

        if position >= 0:
            description = text[position + len(marker):].strip()

            if len(description) >= 50:
                return description

    return None
