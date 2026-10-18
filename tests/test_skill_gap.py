
from candidate_profile.candidate_profile import (
    CandidateProfile,
    SkillEvidence,
)
from candidate_profile.job_requirements_extractor import (
    JobRequirements,
)
from candidate_profile.skill_gap import analyze_skill_gap


def make_candidate(*skills):
    return CandidateProfile(
        candidate_id="candidate_test",
        skills=[
            SkillEvidence(
                name=name,
                evidence=evidence,
                source_section="Projects",
            )
            for name, evidence in skills
        ],
    )


def make_job(required=(), preferred=()):
    return JobRequirements(
        job_id="job_test",
        title="AI Engineer",
        company_name="Test Company",
        required_skills=[
            SkillEvidence(name=name, evidence=evidence)
            for name, evidence in required
        ],
        preferred_skills=[
            SkillEvidence(name=name, evidence=evidence)
            for name, evidence in preferred
        ],
    )


def test_exact_name_match():
    candidate = make_candidate(
        ("Python", "Implemented a data processing pipeline using Python.")
    )
    job = make_job(required=[("Python", "Strong Python skills required.")])

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert result["required_skill_coverage"] == 1.0
    assert result["matched_required_skills"][0]["status"] == "matched_by_name"


def test_safe_alias_match():
    candidate = make_candidate(
        ("scikit-learn", "Built classification models using scikit-learn.")
    )
    job = make_job(required=[("sklearn", "Experience with sklearn required.")])

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert result["matched_required_skills"][0]["status"] == "matched_by_alias"


def test_deployment_can_match_explicit_cv_evidence():
    candidate = make_candidate(
        (
            "FastAPI",
            "Deployed a machine learning model using FastAPI.",
        )
    )
    job = make_job(
        required=[("model deployment", "Experience deploying ML models.")]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert result["matched_required_skills"][0]["status"] == "matched_by_evidence"


def test_fastapi_alone_does_not_prove_model_monitoring():
    candidate = make_candidate(
        ("FastAPI", "Built a REST API using FastAPI.")
    )
    job = make_job(
        required=[("model monitoring", "Monitor production model drift.")]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 0
    assert result["required_skills_not_found_count"] == 1


def test_duplicate_requirements_do_not_inflate_coverage():
    candidate = make_candidate(
        ("Python", "Used Python in an academic project.")
    )
    job = make_job(
        required=[
            ("Python", "Python required."),
            (" python ", "Python mentioned again."),
        ]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["required_skill_count"] == 1
    assert result["matched_required_skill_count"] == 1
    assert result["required_skill_coverage"] == 1.0


def test_preferred_skills_are_counted_separately():
    candidate = make_candidate(
        ("Python", "Used Python in a project.")
    )
    job = make_job(
        required=[("Python", "Python is required.")],
        preferred=[("Docker", "Docker is a plus.")],
    )

    result = analyze_skill_gap(candidate, job)

    assert result["required_skill_coverage"] == 1.0
    assert result["preferred_skill_coverage"] == 0.0
    assert result["preferred_skills_not_found_count"] == 1


def test_project_technology_is_included_in_matching():
    from candidate_profile.candidate_profile import Project

    candidate = CandidateProfile(
        candidate_id="candidate_project_test",
        skills=[],
        projects=[
            Project(
                name="Classification Project",
                description="Built a classification model.",
                technologies=[
                    SkillEvidence(
                        name="PyTorch",
                        evidence="Implemented a neural network.",
                        source_section="Projects",
                    )
                ],
            )
        ],
    )

    job = make_job(
        required=[("PyTorch", "Experience with PyTorch is required.")]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert result["matched_required_skills"][0]["status"] == "matched_by_name"


def test_project_title_and_technology_list_are_removed_from_evidence():
    candidate = make_candidate(
        (
            "Natural Language Processing",
            (
                "Core Concepts: Machine Learning, Deep Learning, "
                "Transformers, Natural Language Processing (NLP)"
                " | AI Report Generation – Python, Gemini API, "
                "Natural Language Processing"
            ),
        )
    )
    job = make_job(
        required=[("NLP", "Experience with NLP is required.")]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1

    evidence = result["matched_required_skills"][0]["candidate_evidence"]

    assert "Core Concepts" in evidence
    assert "AI Report Generation" not in evidence


def test_descriptive_nlp_evidence_is_preserved():
    descriptive_evidence = (
        "Built an NLP pipeline for text classification using Python."
    )
    candidate = make_candidate(
        ("NLP", descriptive_evidence)
    )
    job = make_job(
        required=[("NLP", "Experience with NLP is required.")]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert (
        result["matched_required_skills"][0]["candidate_evidence"]
        == descriptive_evidence
    )


def test_project_title_only_evidence_is_removed():
    candidate = make_candidate(
        (
            "Natural Language Processing",
            (
                "AI Report Generation – Python, Gemini API, "
                "Natural Language Processing"
            ),
        )
    )
    job = make_job(
        required=[
            ("Natural Language Processing", "NLP experience required.")
        ]
    )

    result = analyze_skill_gap(candidate, job)

    assert result["matched_required_skill_count"] == 1
    assert (
        result["matched_required_skills"][0]["candidate_evidence"] == ""
    )
