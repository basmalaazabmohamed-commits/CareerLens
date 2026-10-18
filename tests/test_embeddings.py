from pathlib import Path

import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]

EMBEDDINGS_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "embeddings"
    / "embedding_model.npy"
)

METADATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "embeddings"
    / "embedding_model_metadata.parquet"
)


print("=" * 60)
print("CareerRAG Embedding Test")
print("=" * 60)


# ------------------------------------------------------------
# Check files
# ------------------------------------------------------------

if not EMBEDDINGS_PATH.exists():
    raise FileNotFoundError(
        f"Embeddings file not found:\n{EMBEDDINGS_PATH}"
    )

if not METADATA_PATH.exists():
    raise FileNotFoundError(
        f"Metadata file not found:\n{METADATA_PATH}"
    )


print("\nFiles found successfully.")


# ------------------------------------------------------------
# Load embeddings
# ------------------------------------------------------------

embeddings = np.load(
    EMBEDDINGS_PATH
)


print("\nEmbeddings:")
print(f"Shape: {embeddings.shape}")
print(f"Dtype: {embeddings.dtype}")


# ------------------------------------------------------------
# Validate embeddings
# ------------------------------------------------------------

print(
    f"Contains NaN: {np.isnan(embeddings).any()}"
)

print(
    f"Contains Inf: {np.isinf(embeddings).any()}"
)


# ------------------------------------------------------------
# Load metadata
# ------------------------------------------------------------

metadata = pd.read_parquet(
    METADATA_PATH
)


print("\nMetadata:")
print(f"Shape: {metadata.shape}")

print("\nMetadata columns:")
print(
    metadata.columns.tolist()
)


# ------------------------------------------------------------
# Check mapping
# ------------------------------------------------------------

if len(embeddings) != len(metadata):

    raise RuntimeError(
        "Number of embeddings does not match "
        "number of metadata rows."
    )


print(
    "\nEmbedding ↔ Metadata mapping: OK"
)


# ------------------------------------------------------------
# Check normalized embeddings
# ------------------------------------------------------------

norms = np.linalg.norm(
    embeddings,
    axis=1
)

print(
    f"\nAverage vector norm: {norms.mean():.6f}"
)

print(
    f"Minimum vector norm: {norms.min():.6f}"
)

print(
    f"Maximum vector norm: {norms.max():.6f}"
)


# ------------------------------------------------------------
# Show example
# ------------------------------------------------------------

print("\nExample embedding:")

print(
    embeddings[0][:10]
)

print("\nCorresponding metadata:")

print(
    metadata.iloc[0].to_string()
)


print("\n" + "=" * 60)
print("Embedding test completed successfully.")
print("=" * 60)