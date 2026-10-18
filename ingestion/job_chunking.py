import re
import pandas as pd


# Maximum approximate size of a chunk
MAX_CHUNK_CHARS = 1500

# Number of characters repeated between chunks
CHUNK_OVERLAP = 150


# ============================================================
# Section Configuration
# ============================================================

SECTION_COLUMNS = {
    "job_description": "Job Description",
    "skills_required": "Required Skills",
    "minimum_qualifications": "Minimum Qualifications",
    "preferred_qualifications": "Preferred Qualifications",
    "responsibilities": "Responsibilities",
    "benefits": "Benefits",
    "certifications": "Certifications",
    "languages_required": "Languages Required",
}


# ============================================================
# Text Splitting
# ============================================================

def split_long_text(
    text: str,
    max_chars: int = MAX_CHUNK_CHARS,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """
    Split long text into smaller chunks while trying
    to preserve complete words.

    A small overlap is used so information at the boundary
    is not completely lost.
    """

    text = text.strip()

    if not text:
        return []

    if len(text) <= max_chars:
        return [text]

    chunks = []

    start = 0

    while start < len(text):

        end = min(
            start + max_chars,
            len(text)
        )

        # If this is not the final chunk,
        # try to end at a word boundary.
        if end < len(text):

            last_space = text.rfind(" ", start, end)

            if last_space > start:
                end = last_space

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        # Prevent invalid overlap
        next_start = end - overlap

        if next_start <= start:
            next_start = end

        start = next_start

    return chunks


# ============================================================
# Create Chunks for One Job
# ============================================================

def chunk_job(row: pd.Series) -> list[dict]:
    """
    Convert one job into multiple structure-aware chunks.
    """

    chunks = []

    job_id = row["job_id"]

    title = row.get("title", "")
    company = row.get("company_name", "")

    chunk_number = 0

    for column, section_name in SECTION_COLUMNS.items():

        if column not in row.index:
            continue

        text = row[column]

        if pd.isna(text):
            continue

        text = str(text).strip()

        if not text:
            continue

        # Split section if it is too long
        section_chunks = split_long_text(text)

        for section_chunk in section_chunks:

            chunk_number += 1

            chunk_text = (
                f"Job Title: {title}\n"
                f"Company: {company}\n"
                f"Section: {section_name}\n\n"
                f"{section_chunk}"
            )

            chunks.append(
                {
                    "chunk_id": f"{job_id}_{chunk_number}",
                    "job_id": job_id,
                    "title": title,
                    "company_name": company,
                    "section": section_name,
                    "text": chunk_text,
                }
            )

    return chunks


# ============================================================
# Chunk Entire Dataset
# ============================================================

def create_job_chunks(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create structure-aware chunks for all jobs.
    """

    all_chunks = []

    print("\nStarting job chunking...")

    for _, row in df.iterrows():

        job_chunks = chunk_job(row)

        all_chunks.extend(job_chunks)

    chunks_df = pd.DataFrame(all_chunks)

    print(f"Created {len(chunks_df)} chunks.")

    return chunks_df