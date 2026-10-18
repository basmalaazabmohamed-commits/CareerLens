import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from retrieval.hybrid_search import HybridRetriever
from retrieval.reranker import Reranker


def main():

    query = (
        "AI Engineer with Python, AWS, "
        "machine learning and NLP experience"
    )

    print("=" * 70)
    print("CareerRAG Retrieval Test")
    print("=" * 70)

    # --------------------------------------------------------
    # Hybrid Retrieval
    # --------------------------------------------------------

    hybrid = HybridRetriever()

    results = hybrid.search(
        query=query,
        top_k=10,
        retrieval_k=50,
    )

    print("\nHybrid Results:")

    print(
        results[
            [
                "chunk_id",
                "job_id",
                "title",
                "company_name",
                "section",
                "rrf_score",
            ]
        ].to_string(index=False)
    )

    # --------------------------------------------------------
    # Reranking
    # --------------------------------------------------------

    reranker = Reranker()

    final_results = reranker.rerank(
        query=query,
        results=results,
        top_k=5,
    )

    print("\n" + "=" * 70)
    print("Final Reranked Results")
    print("=" * 70)

    print(
        final_results[
            [
                "chunk_id",
                "job_id",
                "title",
                "company_name",
                "section",
                "rrf_score",
                "reranker_score",
                "reranker_rank",
            ]
        ].to_string(index=False)
    )


if __name__ == "__main__":
    main()