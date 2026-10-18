
import hashlib
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# Load API settings from the project .env file.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not API_KEY or API_KEY == "PASTE_YOUR_API_KEY_HERE":
    raise RuntimeError(
        "Set a valid GEMINI_API_KEY in the project .env file."
    )


# Persistent local cache. Prompts themselves are NOT saved.
CACHE_DIR = PROJECT_ROOT / "data" / "processed" / "gemini_cache"
CACHE_VERSION = "v1"


# Retry only a limited number of times for transient API errors.
# Three attempts means the initial request plus at most two retries.
http_options = types.HttpOptions(
    retry_options=types.HttpRetryOptions(
        attempts=3,
        initial_delay=2.0,
        max_delay=20.0,
        exp_base=2.0,
        jitter=1.0,
        http_status_codes=[408, 429, 500, 502, 503, 504],
    )
)

client = genai.Client(
    api_key=API_KEY,
    http_options=http_options,
)


def _cache_path(prompt: str, schema) -> Path:
    """Create a stable cache key without storing the prompt."""
    cache_identity = {
        "cache_version": CACHE_VERSION,
        "model": MODEL_NAME,
        "schema": schema.__name__,
        "prompt": prompt,
    }

    serialized = json.dumps(
        cache_identity,
        sort_keys=True,
        ensure_ascii=False,
    )

    cache_key = hashlib.sha256(
        serialized.encode("utf-8")
    ).hexdigest()

    return CACHE_DIR / f"{cache_key}.json"


def generate_structured(
    prompt: str,
    schema,
    use_cache: bool = True,
):
    """
    Generate structured Pydantic output with local caching.

    Identical model + schema + prompt inputs reuse the saved result.
    Set use_cache=False to explicitly request a fresh model response.
    """
    path = _cache_path(prompt, schema)

    if use_cache and path.is_file():
        try:
            cached_data = json.loads(
                path.read_text(encoding="utf-8")
            )
            return schema.model_validate(cached_data)
        except (json.JSONDecodeError, ValueError, TypeError):
            # Ignore corrupt or outdated cache entries and regenerate.
            pass

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0,
            ),
        )
    except Exception as exc:
        # Keep the original exception details available for debugging.
        status_code = getattr(exc, "code", None)

        if status_code == 503:
            raise RuntimeError(
                "Gemini is temporarily unavailable after retry attempts. "
                "Wait before trying again. Successful cached results "
                "will remain available."
            ) from exc

        if status_code == 429:
            raise RuntimeError(
                "Gemini returned 429 RESOURCE_EXHAUSTED. "
                "Check whether the request-per-minute or daily quota "
                "has been exhausted. Retries cannot restore an exhausted "
                "daily quota."
            ) from exc

        raise

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    result = schema.model_validate_json(response.text)

    if use_cache:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)

        temporary_path = path.with_suffix(".tmp")
        temporary_path.write_text(
            json.dumps(
                result.model_dump(),
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        temporary_path.replace(path)

    return result
