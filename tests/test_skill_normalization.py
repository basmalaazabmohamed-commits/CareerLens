
from candidate_profile.candidate_profile import SkillEvidence
from candidate_profile import skill_normalization


def test_normalization_preserves_evidence_and_source(monkeypatch):
    def fake_generate_structured(prompt, schema):
        return schema(
            skills=[
                {
                    "original_name": "sklearn",
                    "normalized_name": "Scikit-learn",
                }
            ]
        )

    monkeypatch.setattr(
        skill_normalization,
        "generate_structured",
        fake_generate_structured,
    )

    skills = [
        SkillEvidence(
            name="sklearn",
            evidence="Used sklearn for classification.",
            source_section="Projects",
        )
    ]

    result = skill_normalization.normalize_skills(skills)

    assert result[0].name == "Scikit-learn"
    assert result[0].evidence == "Used sklearn for classification."
    assert result[0].source_section == "Projects"


def test_normalization_falls_back_when_mapping_is_missing(monkeypatch):
    def fake_generate_structured(prompt, schema):
        return schema(skills=[])

    monkeypatch.setattr(
        skill_normalization,
        "generate_structured",
        fake_generate_structured,
    )

    skills = [
        SkillEvidence(
            name="Amazon SageMaker",
            evidence="Used SageMaker Pipelines.",
            source_section="Projects",
        )
    ]

    result = skill_normalization.normalize_skills(skills)

    assert result[0].name == "Amazon SageMaker"



def test_normalization_does_not_drop_duplicate_evidence(monkeypatch):
    def fake_generate_structured(prompt, schema):
        return schema(
            skills=[
                {
                    "original_name": "SageMaker",
                    "normalized_name": "Amazon SageMaker",
                }
            ]
        )

    monkeypatch.setattr(
        skill_normalization,
        "generate_structured",
        fake_generate_structured,
    )

    skills = [
        SkillEvidence(
            name="SageMaker",
            evidence="Used SageMaker in a project.",
            source_section="Projects",
        ),
        SkillEvidence(
            name="SageMaker",
            evidence="Built SageMaker Pipelines.",
            source_section="Experience",
        ),
    ]

    result = skill_normalization.normalize_skills(skills)

    assert len(result) == 2
    assert all(
        skill.name == "Amazon SageMaker"
        for skill in result
    )
    assert result[0].evidence == "Used SageMaker in a project."
    assert result[1].evidence == "Built SageMaker Pipelines."
    assert result[0].source_section == "Projects"
    assert result[1].source_section == "Experience"
