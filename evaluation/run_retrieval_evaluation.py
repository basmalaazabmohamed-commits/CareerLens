
import json
from pathlib import Path

import pandas as pd

from retrieval.hybrid_search import HybridRetriever
from retrieval.reranker import Reranker
from evaluation.retrieval_metrics import (
    recall_at_k,
    reciprocal_rank_at_k,
    ndcg_at_k,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]

QUERIES_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "retrieval_queries.json"
)

OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "evaluation_results.json"
)


def get_job_ids(results) -> list[str]:
    if isinstance(results, pd.DataFrame):
        if "job_id" not in results.columns:
            raise ValueError(
                "Retrieval results must contain a job_id column."
            )

        return (
            results["job_id"]
            .dropna()
            .astype(str)
            .drop_duplicates()
            .tolist()
        )

    if isinstance(results, list):
        ids = []

        for item in results:
            if isinstance(item, dict) and item.get("job_id") is not None:
                ids.append(str(item["job_id"]))

        return list(dict.fromkeys(ids))

    raise TypeError(
        f"Unsupported retrieval result type: {type(results).__name__}"
    )


def main():
    with open(QUERIES_PATH, "r", encoding="utf-8") as file:
        test_cases = json.load(file)

    retriever = HybridRetriever()
    reranker = Reranker()

    reports = []

    for index, case in enumerate(test_cases, start=1):
        query = case["query"]
        relevant_ids = [
            str(job_id)
            for job_id in case.get("relevant_job_ids", [])
        ]

        candidates = retriever.search(
            query=query,
            top_k=50,
            retrieval_k=50,
        )

        ranked = reranker.rerank(
            query=query,
            results=candidates,
            top_k=10,
        )

        retrieved_ids = get_job_ids(ranked)

        relevance_by_id = {
            str(job_id): float(score)
            for job_id, score in case.get(
                "relevance_by_id", {}
            ).items()
        }

        report = {
            "query": query,
            "retrieved_job_ids": retrieved_ids,
            "relevant_job_ids": relevant_ids,
            "recall_at_5": recall_at_k(
                retrieved_ids, relevant_ids, 5
            ),
            "recall_at_10": recall_at_k(
                retrieved_ids, relevant_ids, 10
            ),
            "mrr_at_10": reciprocal_rank_at_k(
                retrieved_ids, relevant_ids, 10
            ),
            "ndcg_at_10": ndcg_at_k(
                retrieved_ids, relevance_by_id, 10
            ),
        }

        reports.append(report)

        print(f"\nQuery {index}: {query}")
        print("Retrieved IDs:", retrieved_ids[:10])
        print(f"Recall@5: {report['recall_at_5']:.3f}")
        print(f"Recall@10: {report['recall_at_10']:.3f}")
        print(f"MRR@10: {report['mrr_at_10']:.3f}")
        print(f"nDCG@10: {report['ndcg_at_10']:.3f}")

    valid_reports = [
        report for report in reports
        if report["relevant_job_ids"]
    ]

    summary = {
        "number_of_queries": len(test_cases),
        "queries_with_relevance_labels": len(valid_reports),
        "mean_recall_at_5": (
            sum(r["recall_at_5"] for r in valid_reports)
            / len(valid_reports)
            if valid_reports else None
        ),
        "mean_recall_at_10": (
            sum(r["recall_at_10"] for r in valid_reports)
            / len(valid_reports)
            if valid_reports else None
        ),
        "mean_mrr_at_10": (
            sum(r["mrr_at_10"] for r in valid_reports)
            / len(valid_reports)
            if valid_reports else None
        ),
        "mean_ndcg_at_10": (
            sum(r["ndcg_at_10"] for r in valid_reports)
            / len(valid_reports)
            if valid_reports else None
        ),
        "queries": reports,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        json.dump(summary, file, ensure_ascii=False, indent=2)

    print("\nEvaluation summary:")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"\nSaved results to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
