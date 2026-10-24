
from fastapi import APIRouter, HTTPException

from retrieval.job_lookup import get_job_record


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}")
def get_job(job_id: str):
    """Return the stored job record for a given job_id."""
    job_id = job_id.strip()

    if not job_id:
        raise HTTPException(status_code=400, detail="job_id cannot be empty.")

    record = get_job_record(job_id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail=f"Job '{job_id}' not found in the dataset.",
        )

    return record
