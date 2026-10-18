
import re

from pydantic import BaseModel, Field

from candidate_profile.candidate_profile import SkillEvidence
from candidate_profile.gemini_client import generate_structured


class NormalizedSkill(BaseModel):
    original_name: str
    normalized_name: str


class NormalizationResult(BaseModel):
    skills: list[NormalizedSkill] = Field(default_factory=list)


def _name_key(name: str) -> str:
    """Create a stable key for matching input skill names."""
    name = (name or "").casefold().strip()
    name = name.replace("&", " and ")
    name = re.sub(r"[-_./]+", " ", name)
    name = re.sub(r"[^\w+# ]+", "", name)
    return " ".join(name.split())


def normalize_skills(
    skills: list[SkillEvidence],
) -> list[SkillEvidence]:
    """Normalize names while preserving one output per input skill."""

    if not skills:
        return []

    unique_names = list(
        dict.fromkeys(
            skill.name.strip()
            for skill in skills
            if skill.name and skill.name.strip()
        )
    )

    if not unique_names:
        return []

    prompt = f"""
Normalize the names of these candidate skills.

Rules:
- Do not add skills that are not in the input.
- Preserve the meaning of every skill.
- Normalize spelling, common abbreviations, and clear synonyms.
- Do not merge technologies that are meaningfully different.
- Do not convert a broad concept into a specific product.
- If unsure, preserve the original name.
- Return one mapping for every input name.
- original_name must exactly match an input name.

Input skills:
{unique_names}
"""

    result = generate_structured(prompt, NormalizationResult)

    input_by_key = {_name_key(name): name for name in unique_names}
    mapping = {}

    for item in result.skills:
        original = (item.original_name or "").strip()
        canonical = (item.normalized_name or "").strip()
        key = _name_key(original)

        if key in input_by_key and canonical:
            mapping[input_by_key[key]] = canonical

    normalized = []

    for skill in skills:
        original_name = (skill.name or "").strip()

        if not original_name:
            continue

        canonical_name = mapping.get(original_name, original_name)

        normalized.append(
            skill.model_copy(update={"name": canonical_name})
        )

    return normalized
