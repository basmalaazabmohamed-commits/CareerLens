from pathlib import Path

import pandas as pd

from retrieval.bm25_search import BM25Retriever
from retrieval.semantic_search import SemanticRetriever
from retrieval.rrf import reciprocal_rank_fusion


# ============================================================
# Hybrid Retriever
# ============================================================

class HybridRetriever:

    def __init__(self):

        print("\nInitializing Hybrid Retriever...")

        self.semantic_retriever = (
            SemanticRetriever()
        )

        self.bm25_retriever = (
            BM25Retriever()
        )

        print(
            "Hybrid Retriever initialized."
        )

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------

    def search(
        self,
        query: str,
        top_k: int = 20,
        retrieval_k: int = 50,
    ) -> pd.DataFrame:
        """
        Perform:

        Semantic Retrieval
              +
        BM25 Retrieval
              ↓
             RRF
        """

        # ----------------------------------------------------
        # Semantic retrieval
        # ----------------------------------------------------

        semantic_results = (
            self.semantic_retriever.search(
                query,
                top_k=retrieval_k,
            )
        )

        # ----------------------------------------------------
        # BM25 retrieval
        # ----------------------------------------------------

        bm25_results = (
            self.bm25_retriever.search(
                query,
                top_k=retrieval_k,
            )
        )

        # ----------------------------------------------------
        # RRF
        # ----------------------------------------------------

        hybrid_results = (
            reciprocal_rank_fusion(
                result_lists=[
                    semantic_results,
                    bm25_results,
                ],
                rank_columns=[
                    "semantic_rank",
                    "bm25_rank",
                ],
                id_column="chunk_id",
            )
        )

        # ----------------------------------------------------
        # Return top-k
        # ----------------------------------------------------

        return hybrid_results.head(
            top_k
        ).reset_index(
            drop=True
        )