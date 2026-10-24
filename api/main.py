
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from api.routes.chat import router as chat_router
from api.routes.cv import router as cv_router
from api.routes.jobs import router as jobs_router

PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIST_DIR = PROJECT_ROOT / "frontend" / "dist"

app = FastAPI(
    title="CareerRAG API",
    description=(
        "A retrieval-augmented career assistant "
        "for job discovery and candidate skill analysis."
    ),
    version="0.1.0",
)

# Allow the CareerLens frontend dev server and any local origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(cv_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


# Mount built frontend if available to run the entire unified app on a single server/port
if FRONTEND_DIST_DIR.is_dir():
    assets_dir = FRONTEND_DIST_DIR / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = FRONTEND_DIST_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST_DIR / "index.html")

