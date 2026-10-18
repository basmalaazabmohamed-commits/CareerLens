import re
import html
import unicodedata
import ast

import pandas as pd


# ============================================================
# Columns selected for CareerRAG
# ============================================================

SELECTED_COLUMNS = [
    # Job identity
    "title",
    "normalized_title",
    "company_name",

    # Main RAG content
    "job_description",
    "skills_required",
    "minimum_qualifications",
    "preferred_qualifications",
    "responsibilities",
    "benefits",

    # Useful optional content
    "certifications",
    "languages_required",

    # Retrieval / filtering metadata
    "country",
    "city",
    "work_model",
    "employment_type",
    "experience_level",
    "job_level_normalized",

    # Optional metadata
    "salary_min",
    "salary_max",
    "salary_currency",
    "salary_rate_unit",
    "date_posted",
]


# ============================================================
# Text columns
# ============================================================

TEXT_COLUMNS = [
    "title",
    "normalized_title",
    "company_name",
    "job_description",
    "skills_required",
    "minimum_qualifications",
    "preferred_qualifications",
    "responsibilities",
    "benefits",
    "certifications",
    "languages_required",
]


# ============================================================
# List-like text columns
# ============================================================

LIST_LIKE_COLUMNS = [
    "skills_required",
    "minimum_qualifications",
    "preferred_qualifications",
    "responsibilities",
    "benefits",
    "certifications",
    "languages_required",
]


# ============================================================
# Column Selection
# ============================================================

def select_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Keep only columns that are relevant to CareerRAG.
    """

    available_columns = [
        col
        for col in SELECTED_COLUMNS
        if col in df.columns
    ]

    df = df[available_columns].copy()

    return df


# ============================================================
# Text Cleaning
# ============================================================

def clean_text(value):
    """
    Clean a single text value while preserving
    technical terms and meaningful punctuation.
    """

    if pd.isna(value):
        return ""

    value = str(value)

    # Decode HTML entities
    # Example:
    # &amp; -> &
    value = html.unescape(value)

    # Remove HTML tags if present
    # Example:
    # <p>Python</p> -> Python
    value = re.sub(r"<[^>]+>", " ", value)

    # Normalize Unicode characters
    value = unicodedata.normalize("NFKC", value)

    # Replace tabs, newlines and carriage returns with spaces
    value = re.sub(r"[\r\n\t]+", " ", value)

    # Collapse repeated whitespace
    value = re.sub(r"\s+", " ", value)

    return value.strip()


# ============================================================
# Normalize List-Like Text
# ============================================================

def normalize_list_like_text(value):
    """
    Convert list-like text into readable natural text.

    Example:

    ["Python", "AWS", "SQL"]

    becomes:

    "Python, AWS, SQL"

    If the value is not a list-like string,
    it is returned as normal text.
    """

    if pd.isna(value):
        return ""

    value = str(value).strip()

    if not value:
        return ""

    # --------------------------------------------------------
    # Try to parse actual Python-style list strings
    # --------------------------------------------------------
    #
    # Example:
    # '["Python", "AWS", "SQL"]'
    #
    # becomes:
    # ["Python", "AWS", "SQL"]
    #
    # Then we join the elements naturally.
    #
    if value.startswith("[") and value.endswith("]"):

        try:
            parsed_value = ast.literal_eval(value)

            if isinstance(parsed_value, list):

                cleaned_items = []

                for item in parsed_value:

                    item = str(item).strip()

                    if item:
                        cleaned_items.append(item)

                return ", ".join(cleaned_items)

        except (ValueError, SyntaxError):
            # If parsing fails, continue with
            # a safer fallback approach.
            pass

    # --------------------------------------------------------
    # Fallback for list-like strings
    # --------------------------------------------------------

    if value.startswith("[") and value.endswith("]"):
        value = value[1:-1]

    # Remove quotation marks
    value = value.replace('"', "")
    value = value.replace("'", "")

    # Normalize comma spacing
    value = re.sub(r"\s*,\s*", ", ", value)

    # Remove repeated whitespace
    value = re.sub(r"\s+", " ", value)

    return value.strip()


# ============================================================
# Text Cleaning for All Text Columns
# ============================================================

def clean_text_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean all selected text columns.
    """

    # --------------------------------------------------------
    # First: general text cleaning
    # --------------------------------------------------------

    for column in TEXT_COLUMNS:

        if column in df.columns:

            df[column] = df[column].apply(clean_text)

    # --------------------------------------------------------
    # Second: normalize list-like columns
    # --------------------------------------------------------

    for column in LIST_LIKE_COLUMNS:

        if column in df.columns:

            df[column] = df[column].apply(
                normalize_list_like_text
            )

    return df


# ============================================================
# Missing Values
# ============================================================

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handle missing values appropriately.

    Text fields:
        NaN -> ""

    Metadata:
        Keep NaN because missing metadata is different
        from an actual value.
    """

    for column in TEXT_COLUMNS:

        if column in df.columns:

            df[column] = df[column].fillna("")

    return df


# ============================================================
# Remove Invalid Jobs
# ============================================================

def remove_invalid_jobs(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove jobs that don't contain the minimum
    information required for CareerRAG.

    A valid job must contain:
        - title
        - job_description
    """

    initial_count = len(df)

    # --------------------------------------------------------
    # A job must have a title
    # --------------------------------------------------------

    if "title" in df.columns:

        df = df[
            df["title"].str.strip() != ""
        ]

    # --------------------------------------------------------
    # A job must have a description
    # --------------------------------------------------------

    if "job_description" in df.columns:

        df = df[
            df["job_description"].str.strip() != ""
        ]

    removed_count = initial_count - len(df)

    print(
        f"Removed invalid jobs: {removed_count}"
    )

    return df


# ============================================================
# Remove Exact Duplicate Jobs
# ============================================================

def remove_duplicate_jobs(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove exact duplicate job records.

    We use:
        title
        company_name
        job_description

    because these fields represent the actual
    job posting content.
    """

    duplicate_columns = [
        column
        for column in [
            "title",
            "company_name",
            "job_description",
        ]
        if column in df.columns
    ]

    initial_count = len(df)

    if duplicate_columns:

        df = df.drop_duplicates(
            subset=duplicate_columns,
            keep="first"
        )

    removed_count = initial_count - len(df)

    print(
        f"Removed duplicate jobs: {removed_count}"
    )

    return df


# ============================================================
# Add Job ID
# ============================================================

def add_job_id(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create a unique internal ID for every job.
    """

    df = df.reset_index(drop=True)

    df["job_id"] = range(
        1,
        len(df) + 1
    )

    return df


# ============================================================
# Main Cleaning Pipeline
# ============================================================

def clean_jobs(df: pd.DataFrame) -> pd.DataFrame:
    """
    Complete cleaning pipeline for CareerRAG.

    Pipeline:

    1. Select relevant columns
    2. Clean text
    3. Normalize list-like fields
    4. Handle missing text values
    5. Remove invalid jobs
    6. Remove duplicate jobs
    7. Add job IDs
    """

    print("\nStarting job cleaning...")

    # --------------------------------------------------------
    # 1. Select relevant columns
    # --------------------------------------------------------

    df = select_columns(df)

    print(
        f"After column selection: {df.shape}"
    )

    # --------------------------------------------------------
    # 2. Clean text
    # --------------------------------------------------------

    df = clean_text_columns(df)

    # --------------------------------------------------------
    # 3. Handle missing values
    # --------------------------------------------------------

    df = handle_missing_values(df)

    # --------------------------------------------------------
    # 4. Remove invalid jobs
    # --------------------------------------------------------

    df = remove_invalid_jobs(df)

    # --------------------------------------------------------
    # 5. Remove duplicate jobs
    # --------------------------------------------------------

    df = remove_duplicate_jobs(df)

    # --------------------------------------------------------
    # 6. Add unique job IDs
    # --------------------------------------------------------

    df = add_job_id(df)

    print(
        f"Final cleaned dataset: {df.shape}"
    )

    return df