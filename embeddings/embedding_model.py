from pathlib import Path

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer


# ============================================================
# Paths
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

CHUNKS_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "job_chunks.parquet"
)

EMBEDDINGS_DIR = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "jobs"
    / "embeddings"
)

EMBEDDINGS_PATH = (
    EMBEDDINGS_DIR
    / "embedding_model.npy"
)

METADATA_PATH = (
    EMBEDDINGS_DIR
    / "embedding_model_metadata.parquet"
)


# ============================================================
# Embedding Model
# ============================================================

MODEL_NAME = "BAAI/bge-base-en-v1.5"

# Number of texts processed at once
BATCH_SIZE = 64


# ============================================================
# Load Chunks
# ============================================================

def load_chunks(path: Path) -> pd.DataFrame:
    """
    Load processed job chunks.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"Chunk dataset not found:\n{path}"
        )

    df = pd.read_parquet(path)

    print(
        f"Loaded chunks: {df.shape}"
    )

    return df


# ============================================================
# Prepare Texts
# ============================================================

def prepare_texts(df: pd.DataFrame) -> list[str]:
    """
    Extract chunk texts that will be embedded.
    """

    if "text" not in df.columns:
        raise ValueError(
            "The chunk dataset must contain a 'text' column."
        )

    texts = (
        df["text"]
        .fillna("")
        .astype(str)
        .str.strip()
        .tolist()
    )

    return texts


# ============================================================
# Load Embedding Model
# ============================================================

def load_embedding_model() -> SentenceTransformer:
    """
    Load the Sentence Transformer embedding model.
    """

    print(
        f"\nLoading embedding model: {MODEL_NAME}"
    )

    model = SentenceTransformer(
        MODEL_NAME
    )

    print("Embedding model loaded successfully.")

    return model


# ============================================================
# Generate Embeddings
# ============================================================

def generate_embeddings(
    model: SentenceTransformer,
    texts: list[str],
) -> np.ndarray:
    """
    Generate embeddings for all job chunks.
    """

    print("\nGenerating embeddings...")

    embeddings = model.encode(
        texts,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )

    embeddings = embeddings.astype(
        np.float32
    )

    print(
        f"Embedding matrix shape: {embeddings.shape}"
    )

    print(
        f"Embedding dimension: {embeddings.shape[1]}"
    )

    return embeddings


# ============================================================
# Save Embeddings
# ============================================================

def save_embeddings(
    embeddings: np.ndarray,
    path: Path,
) -> None:
    """
    Save embeddings as a NumPy array.
    """

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    np.save(
        path,
        embeddings
    )

    print(
        f"\nEmbeddings saved to:\n{path}"
    )


# ============================================================
# Save Metadata
# ============================================================

def save_metadata(
    df: pd.DataFrame,
    path: Path,
) -> None:
    """
    Save metadata required to map embedding
    vectors back to the original chunks/jobs.
    """

    metadata_columns = [
        "chunk_id",
        "job_id",
        "title",
        "company_name",
        "section",
        "text",
    ]

    available_columns = [
        column
        for column in metadata_columns
        if column in df.columns
    ]

    metadata = df[
        available_columns
    ].copy()

    # The row number is the position of the
    # corresponding vector inside job_embeddings.npy.
    metadata.insert(
        0,
        "embedding_id",
        np.arange(len(metadata))
    )

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    metadata.to_parquet(
        path,
        index=False
    )

    print(
        f"Metadata saved to:\n{path}"
    )


# ============================================================
# Main Pipeline
# ============================================================

def main():

    print("=" * 60)
    print("CareerRAG - Job Embedding Pipeline")
    print("=" * 60)

    # --------------------------------------------------------
    # 1. Load chunks
    # --------------------------------------------------------

    chunks_df = load_chunks(
        CHUNKS_PATH
    )

    # --------------------------------------------------------
    # 2. Prepare texts
    # --------------------------------------------------------

    texts = prepare_texts(
        chunks_df
    )

    print(
        f"Texts prepared: {len(texts)}"
    )

    # --------------------------------------------------------
    # 3. Load model
    # --------------------------------------------------------

    model = load_embedding_model()

    # --------------------------------------------------------
    # 4. Generate embeddings
    # --------------------------------------------------------

    embeddings = generate_embeddings(
        model,
        texts
    )

    # --------------------------------------------------------
    # 5. Validate output
    # --------------------------------------------------------

    if len(embeddings) != len(chunks_df):
        raise RuntimeError(
            "Number of embeddings does not match "
            "number of chunks."
        )

    if not np.isfinite(embeddings).all():
        raise RuntimeError(
            "Embeddings contain NaN or infinite values."
        )

    # --------------------------------------------------------
    # 6. Save embeddings
    # --------------------------------------------------------

    save_embeddings(
        embeddings,
        EMBEDDINGS_PATH
    )

    # --------------------------------------------------------
    # 7. Save metadata
    # --------------------------------------------------------

    save_metadata(
        chunks_df,
        METADATA_PATH
    )

    # --------------------------------------------------------
    # 8. Final information
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("Embedding pipeline completed successfully.")
    print("=" * 60)

    print(
        f"Number of chunks: {len(chunks_df):,}"
    )

    print(
        f"Embedding shape: {embeddings.shape}"
    )

    print(
        f"Embedding dtype: {embeddings.dtype}"
    )

    print(
        f"Embeddings file:\n{EMBEDDINGS_PATH}"
    )

    print(
        f"Metadata file:\n{METADATA_PATH}"
    )


if __name__ == "__main__":
    main()