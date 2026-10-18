from pathlib import Path
import pandas as pd


def load_jobs(file_path: str | Path) -> pd.DataFrame:
    """
    Load the raw jobs dataset from a Parquet file.
    """

    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    df = pd.read_parquet(file_path)

    print(f"Dataset loaded successfully: {df.shape}")

    return df