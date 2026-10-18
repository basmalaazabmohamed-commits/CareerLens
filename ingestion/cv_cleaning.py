
import re
import unicodedata


def clean_cv_text(text: str) -> str:
    """Clean layout noise without removing technical terminology."""
    if not isinstance(text, str):
        raise TypeError("Expected CV text as a string.")

    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\t", " ")

    lines = [
        re.sub(r"[ ]{2,}", " ", line).strip()
        for line in text.split("\n")
    ]

    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()
