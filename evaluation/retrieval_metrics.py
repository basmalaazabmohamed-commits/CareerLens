
import math


def recall_at_k(
    retrieved_ids: list[str],
    relevant_ids: list[str],
    k: int = 10,
) -> float:
    relevant = set(map(str, relevant_ids))

    if not relevant:
        return 0.0

    retrieved = set(map(str, retrieved_ids[:k]))
    return len(retrieved & relevant) / len(relevant)


def reciprocal_rank_at_k(
    retrieved_ids: list[str],
    relevant_ids: list[str],
    k: int = 10,
) -> float:
    relevant = set(map(str, relevant_ids))

    for rank, job_id in enumerate(retrieved_ids[:k], start=1):
        if str(job_id) in relevant:
            return 1.0 / rank

    return 0.0


def ndcg_at_k(
    retrieved_ids: list[str],
    relevance_by_id: dict[str, float],
    k: int = 10,
) -> float:
    def dcg(scores):
        return sum(
            (2**score - 1) / math.log2(rank + 1)
            for rank, score in enumerate(scores, start=1)
        )

    actual_scores = [
        float(relevance_by_id.get(str(job_id), 0))
        for job_id in retrieved_ids[:k]
    ]

    ideal_scores = sorted(
        [float(score) for score in relevance_by_id.values()],
        reverse=True,
    )[:k]

    ideal_dcg = dcg(ideal_scores)

    if ideal_dcg == 0:
        return 0.0

    return dcg(actual_scores) / ideal_dcg
