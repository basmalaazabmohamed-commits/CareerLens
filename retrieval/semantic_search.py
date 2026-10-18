from pathlib import Path

import faiss
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer


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
# Model
# ============================================================

MODEL_NAME = "BAAI/bge-base-en-v1.5"


# ============================================================
# Semantic Retriever
# ============================================================

class SemanticRetriever:

    def __init__(
        self,
        index_path: Path = FAISS_INDEX_PATH,
        metadata_path: Path = METADATA_PATH,
    ):

        self.index = faiss.read_index(
            str(index_path)
        )

        self.metadata = pd.read_parquet(
            metadata_path
        )

        self.model = SentenceTransformer(
            MODEL_NAME
        )

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------

    def search(
        self,
        query: str,
        top_k: int = 20,
    ) -> pd.DataFrame:

        query = query.strip()

        if not query:
            raise ValueError(
                "Query cannot be empty."
            )

        # Generate query embedding
        query_embedding = self.model.encode(
            [query],
            normalize_embeddings=True,
            convert_to_numpy=True,
        )

        query_embedding = query_embedding.astype(
            np.float32
        )

        # FAISS search
        scores, indices = self.index.search(
            query_embedding,
            top_k,
        )

        results = []

        for score, index_id in zip(
            scores[0],
            indices[0],
        ):

            if index_id < 0:
                continue

            row = self.metadata.iloc[
                int(index_id)
            ].copy()

            row["semantic_score"] = float(
                score
            )

            row["semantic_rank"] = len(
                results
            ) + 1

            results.append(row)

        if not results:
            return pd.DataFrame()

        return pd.DataFrame(
            results
        ).reset_index(drop=True)