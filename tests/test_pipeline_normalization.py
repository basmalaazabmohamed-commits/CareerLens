
from candidate_profile.candidate_profile import (
    CandidateProfile,
    Project,
    SkillEvidence,
)
from candidate_profile import pipeline


def test_build_candidate_profile_preserves_skill_grouping(
    monkeypatch,
    tmp_path,
):
    profile = CandidateProfile(
        candidate_id="original_id",
        skills=[
            SkillEvidence(
                name="Python",
                evidence="Used Python.",
                source_section="Skills",
            ),
        ],
        projects=[
            Project(
                name="Project A",
                technologies=[
                    SkillEvidence(
                        name="SageMaker",
                        evidence="Used SageMaker.",
                        source_section="Projects",
                    ),
                ],
            ),
            Project(
                name="Project B",
                technologies=[
                    SkillEvidence(
                        name="FastAPI",
                        evidence="Built an API.",
                        source_section="Projects",
                    ),
                    SkillEvidence(
                        name="PyTorch",
                        evidence="Trained a model.",
                        source_section="Projects",
                    ),
                ],
            ),
        ],
    )

    monkeypatch.setattr(
        pipeline,
        "extract_cv_text",
        lambda path: "CV text",
    )
    monkeypatch.setattr(
        pipeline,
        "clean_cv_text",
        lambda text: text,
    )
    monkeypatch.setattr(
        pipeline,
        "extract_candidate_profile",
        lambda cv_text, candidate_id: profile,
    )

    def fake_normalize(skills):
        # Simulate normalization while keeping one output per input.
        return [
            skill.model_copy(
                update={"name": f"Normalized {skill.name}"}
            )
            for skill in skills
        ]

    monkeypatch.setattr(
        pipeline,
        "normalize_skills",
        fake_normalize,
    )
    monkeypatch.setattr(
        pipeline,
        "PROCESSED_CV_DIR",
        tmp_path,
    )

    # Create a placeholder file because the pipeline checks that
    # the CV file exists before calling the mocked parser.
    cv_path = tmp_path / "candidate.pdf"
    cv_path.write_bytes(b"fake PDF for testing")

    result = pipeline.build_candidate_profile(cv_path)

    # Candidate skills remain separate from project technologies.
    assert len(result.skills) == 1
    assert result.skills[0].name == "Normalized Python"
    assert result.skills[0].evidence == "Used Python."
    assert result.skills[0].source_section == "Skills"

    # Each project's technologies stay assigned to the correct project.
    assert [project.name for project in result.projects] == [
        "Project A",
        "Project B",
    ]

    assert [
        [skill.name for skill in project.technologies]
        for project in result.projects
    ] == [
        ["Normalized SageMaker"],
        ["Normalized FastAPI", "Normalized PyTorch"],
    ]

    # Evidence and source sections must remain intact.
    assert (
        result.projects[0].technologies[0].evidence
        == "Used SageMaker."
    )
    assert (
        result.projects[1].technologies[0].source_section
        == "Projects"
    )

    # The processed CV artifacts must be saved.
    assert (tmp_path / "candidate.json").is_file()
    assert (tmp_path / "candidate.txt").is_file()
