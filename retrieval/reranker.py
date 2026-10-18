import pandas as pd
from sentence_transformers import CrossEncoder


# ============================================================
# Model
# ============================================================

MODEL_NAME = (
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)


# ============================================================
# Reranker
# ============================================================

class Reranker:

    def __init__(
        self,
        model_name: str = MODEL_NAME,
    ):

        print(
            f"\nLoading reranker: {model_name}"
        )

        self.model = CrossEncoder(
            model_name
        )

        print(
            "Reranker loaded successfully."
        )

    # --------------------------------------------------------
    # Rerank
    # --------------------------------------------------------

    def rerank(
        self,
        query: str,
        results: pd.DataFrame,
        top_k: int = 10,
    ) -> pd.DataFrame:
        """
        Rerank candidate documents using a cross-encoder.
        """

        if results.empty:
            return results

        if "text" not in results.columns:
            raise ValueError(
                "Results must contain a 'text' column."
            )

        # ----------------------------------------------------
        # Build query-document pairs
        # ----------------------------------------------------

        pairs = [
            (
                query,
                document,
            )
            for document in results[
                "text"
            ].tolist()
        ]

        # ----------------------------------------------------
        # Predict relevance
        # ----------------------------------------------------

        scores = self.model.predict(
            pairs
        )

        reranked = results.copy()

        reranked[
            "reranker_score"
        ] = scores

        # ----------------------------------------------------
        # Sort by reranker score
        # ----------------------------------------------------

        reranked = reranked.sort_values(
            "reranker_score",
            ascending=False,
        )

        reranked[
            "reranker_rank"
        ] = range(
            1,
            len(reranked) + 1,
        )

        return reranked.head(
            top_k
        ).reset_index(
            drop=True
        )