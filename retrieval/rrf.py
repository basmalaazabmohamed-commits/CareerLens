import pandas as pd


# ============================================================
# Reciprocal Rank Fusion
# ============================================================

def reciprocal_rank_fusion(
    result_lists: list[pd.DataFrame],
    rank_columns: list[str],
    id_column: str = "chunk_id",
    k: int = 60,
) -> pd.DataFrame:
    """
    Combine multiple ranked result lists using RRF.

    RRF score:

        1 / (k + rank)

    Documents appearing in multiple retrieval systems
    receive contributions from each system.
    """

    if len(result_lists) != len(rank_columns):
        raise ValueError(
            "Number of result lists must match "
            "number of rank columns."
        )

    scores = {}

    metadata = {}

    # --------------------------------------------------------
    # Process each retrieval result
    # --------------------------------------------------------

    for results, rank_column in zip(
        result_lists,
        rank_columns,
    ):

        if results.empty:
            continue

        for _, row in results.iterrows():

            document_id = row[id_column]

            rank = int(
                row[rank_column]
            )

            rrf_score = 1.0 / (
                k + rank
            )

            scores[document_id] = (
                scores.get(
                    document_id,
                    0.0,
                )
                + rrf_score
            )

            if document_id not in metadata:
                metadata[document_id] = row.to_dict()

    # --------------------------------------------------------
    # Sort by RRF score
    # --------------------------------------------------------

    ranked_ids = sorted(
        scores.keys(),
        key=lambda document_id:
            scores[document_id],
        reverse=True,
    )

    rows = []

    for rank, document_id in enumerate(
        ranked_ids,
        start=1,
    ):

        row = metadata[
            document_id
        ].copy()

        row["rrf_score"] = scores[
            document_id
        ]

        row["rrf_rank"] = rank

        rows.append(row)

    if not rows:
        return pd.DataFrame()

    return pd.DataFrame(
        rows
    ).reset_index(drop=True)