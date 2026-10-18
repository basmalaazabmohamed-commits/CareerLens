import pytest

import candidate_profile.job_requirements_extractor as extractor
from candidate_profile.job_requirements_extractor import (
    JobRequirements,
    extract_job_requirements,
)
from candidate_profile.candidate_profile import SkillEvidence


def make_skill(name, evidence=""):
    return SkillEvidence(
        name=name,
        evidence=evidence,
        source_section="job_posting",
    )


def test_duplicate_required_skills_are_removed(monkeypatch):
    fake_result = JobRequirements(
        job_id="wrong_id",
        title="Wrong title",
        company_name="Wrong company",
        required_skills=[
            make_skill("Python"),
            make_skill(" python ", "Required: Python experience"),
            make_skill("CI/CD"),
            make_skill("CI-CD"),
        ],
    )

    monkeypatch.setattr(
        extractor,
        "generate_structured",
        lambda prompt, model: fake_result,
    )

    result = extract_job_requirements(
        job_id="job_123",
        title="ML Engineer",
        company_name="Example Company",
        job_text="Python and CI/CD experience required.",
    )

    names = [skill.name for skill in result.required_skills]

    assert names == ["Python", "CI/CD"]


def test_required_skill_is_not_repeated_as_preferred(monkeypatch):
    fake_result = JobRequirements(
        job_id="job_123",
        required_skills=[
            make_skill("Python"),
        ],
        preferred_skills=[
            make_skill("Python"),
            make_skill("Docker"),
        ],
    )

    monkeypatch.setattr(
        extractor,
        "generate_structured",
        lambda prompt, model: fake_result,
    )

    result = extract_job_requirements(
        job_id="job_123",
        title="ML Engineer",
        company_name="Example Company",
        job_text="Python is required. Docker is preferred.",
    )

    assert [s.name for s in result.required_skills] == ["Python"]
    assert [s.name for s in result.preferred_skills] == ["Docker"]


def test_caller_metadata_is_preserved(monkeypatch):
    fake_result = JobRequirements(
        job_id="wrong_id",
        title="Wrong title",
        company_name="Wrong company",
        required_skills=[make_skill("PyTorch")],
    )

    monkeypatch.setattr(
        extractor,
        "generate_structured",
        lambda prompt, model: fake_result,
    )

    result = extract_job_requirements(
        job_id="job_456",
        title="Senior ML Engineer",
        company_name="Example AI",
        job_text="Experience with PyTorch is required.",
    )

    assert result.job_id == "job_456"
    assert result.title == "Senior ML Engineer"
    assert result.company_name == "Example AI"


def test_empty_job_text_raises_error():
    with pytest.raises(ValueError, match="cannot be empty"):
        extract_job_requirements(
            job_id="job_789",
            title="ML Engineer",
            company_name="Example Company",
            job_text="   ",
        )


def test_duplicate_keeps_available_evidence(monkeypatch):
    fake_result = JobRequirements(
        job_id="job_123",
        required_skills=[
            make_skill("TensorFlow"),
            make_skill(" tensorflow ", "Required experience with TensorFlow"),
        ],
    )

    monkeypatch.setattr(
        extractor,
        "generate_structured",
        lambda prompt, model: fake_result,
    )

    result = extract_job_requirements(
        job_id="job_123",
        title="ML Engineer",
        company_name="Example Company",
        job_text="Required experience with TensorFlow.",
    )

    assert len(result.required_skills) == 1
    assert result.required_skills[0].evidence == (
        "Required experience with TensorFlow"
    )