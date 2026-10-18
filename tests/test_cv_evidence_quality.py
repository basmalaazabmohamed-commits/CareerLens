
import json
import re
from pathlib import Path

from candidate_profile.candidate_profile import CandidateProfile


CV_PATH = Path(
    "data/processed/cvs/candidate_001_after_extraction_v3.json"
)

GENERIC_PHRASES = [
    "experienced in",
    "gaining experience in",
    "hands-on experience in",
    "skilled in",
    "strong skills",
    "familiar with",
]

LIST_PREFIXES = [
    "programming languages:",
    "ai & data science tools:",
    "core concepts:",
    "soft skills:",
    "technologies & frameworks:",
]


def inspect_evidence(skill_name, evidence, source, project=""):
    text = " ".join((evidence or "").split())
    normalized = text.casefold()

    flags = []

    if not text:
        flags.append("EMPTY_EVIDENCE")

    if any(normalized.startswith(p) for p in LIST_PREFIXES):
        flags.append("SKILL_LIST_OR_CATEGORY")

    if any(phrase in normalized for phrase in GENERIC_PHRASES):
        flags.append("GENERIC_CLAIM")

    if len(text.split()) < 5:
        flags.append("VERY_SHORT_EVIDENCE")

    if re.fullmatch(r"[\w\s+#./-]+", text) and "," in text:
        flags.append("POSSIBLE_TECHNOLOGY_LIST")

    return {
        "skill": skill_name,
        "source_section": source or "unknown",
        "project": project,
        "evidence": text,
        "flags": flags,
    }


def main():
    if not CV_PATH.exists():
        print(f"ERROR: CV file not found: {CV_PATH}")
        return

    data = json.loads(CV_PATH.read_text(encoding="utf-8"))
    candidate = CandidateProfile.model_validate(data)

    records = []

    for skill in candidate.skills:
        records.append(
            inspect_evidence(
                skill.name,
                skill.evidence,
                skill.source_section,
            )
        )

    for project in candidate.projects:
        for technology in project.technologies:
            records.append(
                inspect_evidence(
                    technology.name,
                    technology.evidence,
                    technology.source_section or "Projects",
                    project.name,
                )
            )

    flagged = [record for record in records if record["flags"]]

    print("\n=== EVIDENCE QUALITY REVIEW ===")
    print(f"Direct CV skills: {len(candidate.skills)}")
    print(f"Projects: {len(candidate.projects)}")
    print(f"Total evidence records: {len(records)}")
    print(f"Records flagged for review: {len(flagged)}")

    for record in flagged:
        print("\n" + "-" * 60)
        print(f"Skill: {record['skill']}")
        print(f"Source: {record['source_section']}")
        if record["project"]:
            print(f"Project: {record['project']}")
        print(f"Flags: {', '.join(record['flags'])}")
        print(f"Evidence: {record['evidence']}")

    output_path = Path("data/evaluation/cv_evidence_audit.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(flagged, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"\nSaved review report to: {output_path}")


if __name__ == "__main__":
    main()
