
import json

import api.routes.chat as chat_route
from fastapi.testclient import TestClient

from api.main import app
from candidate_profile.candidate_profile import CandidateProfile


client = TestClient(app)

JOB_DESCRIPTION = (
    "We need a Machine Learning Engineer with Python, "
    "PyTorch, NLP, model deployment, and experiment tracking."
)


def create_saved_profile(tmp_path, candidate_id="candidate_001"):
    """Create a minimal valid candidate profile for API tests."""
    profile = CandidateProfile(
        candidate_id=candidate_id,
        skills=[
            {
                "name": "Python",
                "evidence": "Used in projects",
                "source_section": "projects",
            }
        ],
    )

    (tmp_path / f"{candidate_id}.json").write_text(
        profile.model_dump_json(),
        encoding="utf-8",
    )


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_custom_job_analysis_returns_expected_fields(
    tmp_path, monkeypatch
):
    create_saved_profile(tmp_path)

    monkeypatch.setattr(
        chat_route, "PROCESSED_CV_DIR", tmp_path
    )
    monkeypatch.setattr(
        chat_route,
        "route_query",
        lambda **kwargs: {"route": "custom_job_gap"},
    )
    monkeypatch.setattr(
        chat_route,
        "analyze_custom_job_description",
        lambda **kwargs: {
            "answer": "Your CV matches Python, but more evidence is needed for NLP.",
            "priority_improvements": [
                "Add evidence of NLP projects if applicable."
            ],
            "follow_up_questions": [
                "Have you deployed an ML model?"
            ],
            "analysis": {"required": [], "matched": []},
            "requirements": {"required_skills": ["Python", "NLP"]},
        },
    )

    response = client.post(
        "/api/chat",
        json={
            "query": "Compare my CV with this job.",
            "candidate_id": "candidate_001",
            "job_description": JOB_DESCRIPTION,
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["route"] == "custom_job_gap"
    assert data["answer"]
    assert data["priority_improvements"]
    assert data["follow_up_questions"]
    assert data["analysis"] == {"required": [], "matched": []}
    assert data["requirements"] == {
        "required_skills": ["Python", "NLP"]
    }
    assert data["citations"] == []
    assert data["retrieved_job_count"] == 0


def test_custom_job_analysis_requires_candidate_id(monkeypatch):
    monkeypatch.setattr(
        chat_route,
        "route_query",
        lambda **kwargs: {"route": "custom_job_gap"},
    )

    response = client.post(
        "/api/chat",
        json={
            "query": "Compare my CV with this job.",
            "job_description": JOB_DESCRIPTION,
        },
    )

    assert response.status_code == 400


def test_custom_job_analysis_returns_404_for_missing_profile(
    tmp_path, monkeypatch
):
    monkeypatch.setattr(
        chat_route, "PROCESSED_CV_DIR", tmp_path
    )
    monkeypatch.setattr(
        chat_route,
        "route_query",
        lambda **kwargs: {"route": "custom_job_gap"},
    )

    response = client.post(
        "/api/chat",
        json={
            "query": "Compare my CV with this job.",
            "candidate_id": "candidate_001",
            "job_description": JOB_DESCRIPTION,
        },
    )

    assert response.status_code == 404


def test_invalid_candidate_id_is_rejected():
    response = client.post(
        "/api/chat",
        json={
            "query": "Compare my CV with this job.",
            "candidate_id": "../invalid",
            "job_description": JOB_DESCRIPTION,
        },
    )

    assert response.status_code == 400
