
import re
from pathlib import Path

from fastapi import APIRouter, HTTPException
from generation.dataset_job_analysis import (
    analyze_candidate_against_dataset_jobs,
)
from api.models import ChatRequest, ChatResponse
from candidate_profile.candidate_profile import CandidateProfile
from generation.rag_chain import answer_user_query
from generation.custom_job_analysis import analyze_custom_job_description
from routing.query_router import (
    route_query,
    extract_inline_job_description,
)


router = APIRouter(tags=["chat"])

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_CV_DIR = PROJECT_ROOT / "data" / "processed" / "cvs"


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    candidate_profile = None

    # Load a previously processed candidate profile, if requested.
    if request.candidate_id:
        candidate_id = request.candidate_id.strip()

        if not re.fullmatch(r"[a-zA-Z0-9_-]+", candidate_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid candidate_id.",
            )

        profile_path = PROCESSED_CV_DIR / f"{candidate_id}.json"

        if not profile_path.is_file():
            raise HTTPException(
                status_code=404,
                detail=(
                    "Candidate profile not found. "
                    "Process the CV before using candidate-specific analysis."
                ),
            )

        try:
            candidate_profile = CandidateProfile.model_validate_json(
                profile_path.read_text(encoding="utf-8")
            )
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail="Could not load the saved candidate profile.",
            ) from exc

    # Prefer the explicit field; otherwise inspect the query for a pasted JD.
    job_description = (
        request.job_description
        or extract_inline_job_description(request.query)
    )

    routing = route_query(
        query=request.query,
        candidate_id=request.candidate_id,
        job_description=job_description,
    )

    try:
        if routing["route"] == "custom_job_gap":
            if candidate_profile is None:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Provide candidate_id for a processed CV, "
                        "then submit the job description."
                    ),
                )

            result = analyze_custom_job_description(
                candidate_profile=candidate_profile,
                job_description=job_description or "",
            )

            return ChatResponse(
                answer=result["answer"],
                citations=[],
                follow_up_questions=result["follow_up_questions"],
                retrieved_job_count=0,
                route="custom_job_gap",
                priority_improvements=result["priority_improvements"],
                analysis=result["analysis"],
                requirements=result["requirements"],
            )

        if routing["route"] == "candidate_job_search":
            if candidate_profile is None:
                raise HTTPException(
                    status_code=400,
                    detail="Provide a processed candidate_id.",
                )

            result = analyze_candidate_against_dataset_jobs(
                query=request.query,
                candidate_profile=candidate_profile,
                retrieval_k=request.retrieval_k,
                rerank_k=request.rerank_k,
                max_jobs=3,
            )

            return ChatResponse(
                answer=result["answer"],
                citations=result["citations"],
                follow_up_questions=result["follow_up_questions"],
                retrieved_job_count=result["retrieved_job_count"],
                route="candidate_job_search",
                priority_improvements=result["priority_improvements"],
                analysis={"jobs": result["analysis"]},
            )
        
        if (
            routing["route"] == "candidate_job_search"
            and candidate_profile is None
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "This question needs a candidate profile. "
                    "Provide a processed candidate_id."
                ),
            )

        result = answer_user_query(
            query=request.query,
            candidate_profile=candidate_profile,
            history=[
                message.model_dump()
                for message in request.history
            ],
            retrieval_k=request.retrieval_k,
            rerank_k=request.rerank_k,
        )

        return ChatResponse(
            **result,
            route=routing["route"],
        )

    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc
