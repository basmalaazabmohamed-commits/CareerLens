from pathlib import Path

import faiss
import numpy as np
import pandas as pd


# ============================================================
# Paths
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

FAISS_INDEX_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "vector_store"
    / "jobs.faiss"
)

METADATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "embeddings"
    / "embedding_model_metadata.parquet"
)


# ============================================================
# Test
# ============================================================

print("=" * 60)
print("CareerRAG - FAISS Vector Store Test")
print("=" * 60)


# ------------------------------------------------------------
# 1. Check files
# ------------------------------------------------------------

if not FAISS_INDEX_PATH.exists():

    raise FileNotFoundError(
        f"FAISS index not found:\n{FAISS_INDEX_PATH}"
    )

if not METADATA_PATH.exists():

    raise FileNotFoundError(
        f"Metadata not found:\n{METADATA_PATH}"
    )


print("\nRequired files found.")


# ------------------------------------------------------------
# 2. Load FAISS index
# ------------------------------------------------------------

index = faiss.read_index(
    str(FAISS_INDEX_PATH)
)

print("\nFAISS index loaded.")

print(
    f"Index type: {type(index).__name__}"
)

print(
    f"Number of vectors: {index.ntotal:,}"
)

print(
    f"Vector dimension: {index.d}"
)


# ------------------------------------------------------------
# 3. Load metadata
# ------------------------------------------------------------

metadata = pd.read_parquet(
    METADATA_PATH
)

print(
    f"\nMetadata rows: {len(metadata):,}"
)


# ------------------------------------------------------------
# 4. Validate vector count
# ------------------------------------------------------------

if index.ntotal != len(metadata):

    raise RuntimeError(
        "FAISS vector count does not match "
        "metadata row count."
    )


print(
    "Vector ↔ Metadata count: OK"
)


# ------------------------------------------------------------
# 5. Test search
# ------------------------------------------------------------

print("\nTesting vector search...")


# Reconstruct the first vector from FAISS
query_vector = index.reconstruct(
    0
)

query_vector = np.asarray(
    query_vector,
    dtype=np.float32
).reshape(1, -1)


# Search top 5
scores, indices = index.search(
    query_vector,
    5
)


# ------------------------------------------------------------
# 6. Display results
# ------------------------------------------------------------

print("\nTop 5 results:")

for rank, (score, idx) in enumerate(
    zip(scores[0], indices[0]),
    start=1
):

    row = metadata.iloc[idx]

    print("\n" + "-" * 60)

    print(
        f"Rank: {rank}"
    )

    print(
        f"FAISS index: {idx}"
    )

    print(
        f"Similarity: {score:.4f}"
    )

    print(
        f"Chunk ID: {row['chunk_id']}"
    )

    print(
        f"Job ID: {row['job_id']}"
    )

    print(
        f"Title: {row['title']}"
    )

    print(
        f"Company: {row['company_name']}"
    )

    print(
        f"Section: {row['section']}"
    )


print("\n" + "=" * 60)
print("FAISS vector store test completed successfully.")
print("=" * 60)