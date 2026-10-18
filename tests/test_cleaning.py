import sys
from pathlib import Path

# ============================================================
# Add project root to Python path
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# Imports
# ============================================================

from ingestion.job_loader import load_jobs
from ingestion.job_cleaning import clean_jobs
from ingestion.job_chunking import create_job_chunks


# ============================================================
# Paths
# ============================================================

RAW_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "jobs"
    / "nextgig_jobs.parquet"
)

PROCESSED_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "processed_jobs.parquet"
)

CHUNKS_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "job_chunks.parquet"
)


# ============================================================
# Load Raw Dataset
# ============================================================

df = load_jobs(RAW_DATA_PATH)

print("\nBefore cleaning:")
print(df.shape)


# ============================================================
# Cleaning
# ============================================================

cleaned_df = clean_jobs(df)

print("\nAfter cleaning:")
print(cleaned_df.shape)


# ============================================================
# Show Columns
# ============================================================

print("\nCleaned columns:")

for column in cleaned_df.columns:
    print(f"- {column}")


# ============================================================
# Save Cleaned Dataset
# ============================================================

PROCESSED_DATA_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)

cleaned_df.to_parquet(
    PROCESSED_DATA_PATH,
    index=False
)

print(
    f"\nCleaned dataset saved to:\n"
    f"{PROCESSED_DATA_PATH}"
)


# ============================================================
# Chunking
# ============================================================

chunks_df = create_job_chunks(cleaned_df)

print("\nChunk dataset shape:")
print(chunks_df.shape)


# ============================================================
# Show Example Chunks
# ============================================================

print("\nExample chunks:")

print(
    chunks_df[
        [
            "chunk_id",
            "job_id",
            "section",
            "text",
        ]
    ].head(10).to_string(index=False)
)


# ============================================================
# Save Chunks
# ============================================================

chunks_df.to_parquet(
    CHUNKS_DATA_PATH,
    index=False
)

print(
    f"\nChunks saved to:\n"
    f"{CHUNKS_DATA_PATH}"
)