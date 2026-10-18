
from functools import lru_cache
from pathlib import Path
import json

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_JOBS_PATH = (
    PROJECT_ROOT / "data" / "processed" / "jobs"
    / "processed_jobs.parquet"
)

# Prioritize fields useful for job requirement extraction.
JOB_TEXT_COLUMNS = [
    "job_description",
    "skills_required",
    "qualifications",
    "responsibilities",
    "certifications",
    "languages",
    "experience_level",
    "job_level_normalized",
    "employment_type",
    "work_model",
    "benefits",
]


def _normalize_id(value) -> str:
    """Normalize numeric/string job IDs for matching."""
    value = str(value).strip()

    if value.endswith(".0"):
        value = value[:-2]

    return value


def _stringify(value) -> str:
    """Convert a non-empty dataframe value to readable text."""
    if value is None:
        return ""

    if isinstance(value, (list, tuple, dict)):
        value = json.dumps(value, ensure_ascii=False, default=str)
    elif not isinstance(value, str):
        try:
            if pd.isna(value):
                return ""
        except (TypeError, ValueError):
            pass

    text = str(value).strip()

    if text.lower() in {"nan", "none", "null", "n/a"}:
        return ""

    return text


@lru_cache(maxsize=1)
def _load_processed_jobs() -> pd.DataFrame:
    """Load the processed jobs dataset once per Python process."""
    if not PROCESSED_JOBS_PATH.is_file():
        raise FileNotFoundError(
            f"Processed jobs dataset not found: {PROCESSED_JOBS_PATH}"
        )

    jobs = pd.read_parquet(PROCESSED_JOBS_PATH)

    if "job_id" not in jobs.columns:
        raise ValueError(
            "processed_jobs.parquet must contain a job_id column. "
            f"Found columns: {jobs.columns.tolist()}"
        )

    jobs = jobs.copy()
    jobs["_lookup_job_id"] = jobs["job_id"].map(_normalize_id)

    return jobs


def get_job_record(job_id: str | int) -> dict | None:
    """
    Return the original processed job and a combined text representation.

    The combined text is built from available fields, not retrieved chunks.
    """
    jobs = _load_processed_jobs()
    normalized_id = _normalize_id(job_id)

    matches = jobs.loc[
        jobs["_lookup_job_id"] == normalized_id
    ]

    if matches.empty:
        return None

    row = matches.iloc[0]

    parts = []

    for column in JOB_TEXT_COLUMNS:
        if column not in jobs.columns:
            continue

        value = _stringify(row[column])

        if value:
            parts.append(f"{column}: {value}")

    job_text = "\n\n".join(parts)

    # Avoid excessively long prompts. Increase this if your model and
    # quota allow it, or use section-based extraction for very long posts.
    max_chars = 15000
    job_text = job_text[:max_chars]

    return {
        "job_id": normalized_id,
        "title": _stringify(row.get("title", "")),
        "company_name": _stringify(row.get("company_name", "")),
        "job_text": job_text,
    }
