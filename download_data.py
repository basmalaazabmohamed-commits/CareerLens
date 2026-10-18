from huggingface_hub import hf_hub_download
from pathlib import Path
import shutil

REPO_ID = "NextGig-Rocks/global-job-postings-multi-ats"
FILE_NAME = "nextgig_jobs_2026-06.parquet"

OUTPUT_DIR = Path("data/raw/jobs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Downloading NextGig dataset...")

downloaded_file = hf_hub_download(
    repo_id=REPO_ID,
    filename=FILE_NAME,
    repo_type="dataset"
)

destination = OUTPUT_DIR / "nextgig_jobs.parquet"

shutil.copy2(downloaded_file, destination)

print("\nDataset downloaded successfully!")
print(f"Saved to: {destination}")