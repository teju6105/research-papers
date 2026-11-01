from fastapi import FastAPI

app = FastAPI(
    title="Research Paper Recommendation System API",
    description="Backend service for vector search and paper recommendations.",
    version="0.1.0",
)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Confirm that the API process is responsive."""
    return {"status": "ok", "service": "vector-api"}
