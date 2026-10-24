
import re
import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from candidate_profile.candidate_profile import CandidateProfile
from candidate_profile.pipeline import build_candidate_profile


router = APIRouter(prefix="/cv", tags=["cv"])

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_CV_DIR = PROJECT_ROOT / "data" / "processed" / "cvs"

ALLOWED_SUFFIXES = {".pdf", ".docx"}
MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB


def _validate_candidate_id(candidate_id: str) -> str:
    candidate_id = candidate_id.strip()
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", candidate_id):
        raise HTTPException(status_code=400, detail="Invalid candidate_id.")
    return candidate_id


@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    """
    Upload a PDF or DOCX CV.

    The file is saved temporarily, processed through the existing CV
    ingestion pipeline, and the resulting candidate profile is stored in
    data/processed/cvs/.  Returns the candidate_id needed for subsequent
    chat or analysis requests.
    """
    suffix = Path(file.filename or "").suffix.lower()

    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(
            status_code=422,
            detail="Only PDF (.pdf) and DOCX (.docx) files are supported.",
        )

    content = await file.read()

    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File exceeds the 10 MB size limit.",
        )

    if not content:
        raise HTTPException(status_code=422, detail="Uploaded file is empty.")

    with tempfile.NamedTemporaryFile(
        suffix=suffix, delete=False
    ) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        profile = build_candidate_profile(tmp_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="CV processing failed. Check that the file contains extractable text.",
        ) from exc
    finally:
        tmp_path.unlink(missing_ok=True)

    return JSONResponse(
        content={
            "candidate_id": profile.candidate_id,
            "skill_count": len(profile.skills),
            "project_count": len(profile.projects),
            "experience_count": len(profile.experience),
            "message": "CV processed successfully.",
        }
    )


@router.get("/{candidate_id}")
def get_candidate_profile(candidate_id: str):
    """Return the stored candidate profile for a given candidate_id."""
    candidate_id = _validate_candidate_id(candidate_id)
    profile_path = PROCESSED_CV_DIR / f"{candidate_id}.json"

    if not profile_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=(
                "Candidate profile not found. "
                "Upload and process a CV first."
            ),
        )

    try:
        profile = CandidateProfile.model_validate_json(
            profile_path.read_text(encoding="utf-8")
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not load the saved candidate profile.",
        ) from exc

    return profile.model_dump()
