
from pathlib import Path
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]

DATA_PATH = (
    ROOT
    / "data"
    / "processed"
    / "jobs"
    / "processed_jobs.parquet"
)

target_ids = {
    "46634",
    "37373",
    "66599",
    "21950",
    "43652",
    "66957",
    "80151",
    "41040",
    "76587",
    "77315",
    "89482",
    "89602",
    "112043",
    "87624",
    "91179",
    "66128",
    "40180",
}


def normalize_id(value):
    value = str(value).strip()

    if value.endswith(".0"):
        value = value[:-2]

    return value


def main():
    df = pd.read_parquet(DATA_PATH)

    print("Dataset shape:", df.shape)
    print("\nAvailable columns:")
    print(df.columns.tolist())

    if "job_id" not in df.columns:
        raise ValueError("job_id column was not found.")

    df["_normalized_id"] = df["job_id"].map(normalize_id)

    available_columns = [
        col
        for col in [
            "job_id",
            "title",
            "company_name",
            "job_title",
            "company",
            "job_description",
            "skills_required",
            "qualifications",
        ]
        if col in df.columns
    ]

    matches = df[df["_normalized_id"].isin(target_ids)]

    print("\nMatched jobs:", len(matches))
    print("\n" + "=" * 80)

    for _, row in matches.iterrows():
        print("\nJob ID:", row["_normalized_id"])

        for col in available_columns:
            if col == "job_id":
                continue

            value = row[col]

            if pd.isna(value):
                continue

            text = str(value).strip()

            if text:
                print(f"{col}: {text[:700]}")

        print("-" * 80)

    found_ids = set(matches["_normalized_id"])
    missing_ids = target_ids - found_ids

    print("\nIDs not found in processed dataset:")
    print(sorted(missing_ids))


if __name__ == "__main__":
    main()
