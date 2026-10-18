
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from candidate_profile.pipeline import run_cv_pipeline


def main():
    cv_path = PROJECT_ROOT / "data" / "raw" / "cvs" / "candidate_001.pdf"

    report = run_cv_pipeline(cv_path,
    retrieval_k=50,
    rerank_k=20,
    max_jobs=3,)

    print("\n========== CAREERRAG RESULTS ==========")
    print("Candidate ID:", report["candidate_id"])

    for index, job in enumerate(report["matched_jobs"], start=1):
        print(f"\n--- Job {index}: {job['title']} ---")
        print("Company:", job["company_name"])
        print("Job ID:", job["job_id"])
        print("Required skill coverage:", job["required_skill_coverage"])

        print("\nMatched required skills:")
        for skill in job["matched_required_skills"]:
            print("-", skill["skill"])

        print("\nRequired skills not found in CV:")
        for skill in job["required_skills_not_found_in_cv"]:
            print("-", skill["skill"])

    print("\n=======================================")


if __name__ == "__main__":
    main()
