from pathlib import Path
import pandas as pd
from rank_bm25 import BM25Okapi


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


# ============================================================
# Tokenization
# ============================================================

def tokenize(text: str) -> list[str]:
    """
    Simple whitespace-based tokenizer.

    We intentionally avoid aggressive preprocessing
    because technical terms are important.
    """

    return (
        text.lower()
        .strip()
        .split()
    )


# ============================================================
# BM25 Retriever
# ============================================================

class BM25Retriever:

    def __init__(
        self,
        chunks_path: Path = CHUNKS_PATH,
    ):

        self.chunks = pd.read_parquet(
            chunks_path
        )

        if "text" not in self.chunks.columns:
            raise ValueError(
                "Chunk dataset must contain 'text'."
            )

        self.documents = (
            self.chunks["text"]
            .fillna("")
            .astype(str)
            .tolist()
        )

        self.tokenized_documents = [
            tokenize(document)
            for document in self.documents
        ]

        print(
            f"Building BM25 index for "
            f"{len(self.documents):,} chunks..."
        )

        self.bm25 = BM25Okapi(
            self.tokenized_documents
        )

        print("BM25 index ready.")

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------

    def search(
        self,
        query: str,
        top_k: int = 20,
    ) -> pd.DataFrame:

        query_tokens = tokenize(
            query
        )

        scores = self.bm25.get_scores(
            query_tokens
        )

        # Get top-k indices
        top_indices = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True,
        )[:top_k]

        results = self.chunks.iloc[
            top_indices
        ].copy()

        results["bm25_score"] = [
            float(scores[index])
            for index in top_indices
        ]

        results["bm25_rank"] = range(
            1,
            len(results) + 1,
        )

        return results.reset_index(
            drop=True
        )