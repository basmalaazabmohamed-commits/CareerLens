from pathlib import Path

import faiss
import numpy as np
import pandas as pd


# ============================================================
# Paths
# ============================================================

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

VECTOR_STORE_DIR = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "vector_store"
)

FAISS_INDEX_PATH = (
    VECTOR_STORE_DIR
    / "jobs.faiss"
)


# ============================================================
# Load Embeddings
# ============================================================

def load_embeddings(path: Path) -> np.ndarray:
    """
    Load job chunk embeddings.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"Embeddings file not found:\n{path}"
        )

    embeddings = np.load(path)

    print(
        f"Embeddings loaded: {embeddings.shape}"
    )

    print(
        f"Embedding dtype: {embeddings.dtype}"
    )

    return embeddings


# ============================================================
# Load Metadata
# ============================================================

def load_metadata(path: Path) -> pd.DataFrame:
    """
    Load metadata corresponding to the embeddings.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"Metadata file not found:\n{path}"
        )

    metadata = pd.read_parquet(path)

    print(
        f"Metadata loaded: {metadata.shape}"
    )

    return metadata


# ============================================================
# Validate Embeddings and Metadata
# ============================================================

def validate_data(
    embeddings: np.ndarray,
    metadata: pd.DataFrame,
) -> None:
    """
    Make sure embeddings and metadata
    have the same number of rows.
    """

    if len(embeddings) != len(metadata):
        raise ValueError(
            "Number of embeddings does not match "
            "number of metadata rows."
        )

    if embeddings.dtype != np.float32:
        raise ValueError(
            "FAISS expects float32 embeddings."
        )

    if not np.isfinite(embeddings).all():
        raise ValueError(
            "Embeddings contain NaN or infinite values."
        )

    print(
        "Embeddings and metadata validation: OK"
    )


# ============================================================
# Build FAISS Index
# ============================================================

def build_faiss_index(
    embeddings: np.ndarray,
) -> faiss.Index:
    """
    Build an exact FAISS Inner Product index.

    Because our embeddings were normalized during
    embedding generation, Inner Product corresponds
    to cosine similarity.
    """

    dimension = embeddings.shape[1]

    print(
        f"\nEmbedding dimension: {dimension}"
    )

    # Inner Product index
    index = faiss.IndexFlatIP(
        dimension
    )

    print(
        "\nAdding embeddings to FAISS..."
    )

    index.add(
        embeddings
    )

    print(
        f"FAISS vectors stored: {index.ntotal:,}"
    )

    return index


# ============================================================
# Save FAISS Index
# ============================================================

def save_faiss_index(
    index: faiss.Index,
    path: Path,
) -> None:
    """
    Save FAISS index to disk.
    """

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    faiss.write_index(
        index,
        str(path)
    )

    print(
        f"\nFAISS index saved to:\n{path}"
    )


# ============================================================
# Main
# ============================================================

def main():

    print("=" * 60)
    print("CareerRAG - FAISS Vector Store")
    print("=" * 60)

    # --------------------------------------------------------
    # 1. Load embeddings
    # --------------------------------------------------------

    embeddings = load_embeddings(
        EMBEDDINGS_PATH
    )

    # --------------------------------------------------------
    # 2. Load metadata
    # --------------------------------------------------------

    metadata = load_metadata(
        METADATA_PATH
    )

    # --------------------------------------------------------
    # 3. Validate
    # --------------------------------------------------------

    validate_data(
        embeddings,
        metadata
    )

    # --------------------------------------------------------
    # 4. Build FAISS index
    # --------------------------------------------------------

    index = build_faiss_index(
        embeddings
    )

    # --------------------------------------------------------
    # 5. Save index
    # --------------------------------------------------------

    save_faiss_index(
        index,
        FAISS_INDEX_PATH
    )

    # --------------------------------------------------------
    # Final information
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("FAISS Vector Store created successfully.")
    print("=" * 60)

    print(
        f"Vectors: {index.ntotal:,}"
    )

    print(
        f"Dimension: {index.d}"
    )

    print(
        f"Index type: {type(index).__name__}"
    )

    print(
        f"Saved to:\n{FAISS_INDEX_PATH}"
    )


if __name__ == "__main__":
    main()