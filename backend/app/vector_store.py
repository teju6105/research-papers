import os
from functools import lru_cache
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """Load the configured embedding model only when vector operations need it."""
    model_name = os.getenv(
        "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
    )
    return SentenceTransformer(model_name)


@lru_cache(maxsize=1)
def get_paper_collection() -> chromadb.Collection:
    """Open the persistent Chroma collection used for paper embeddings."""
    persist_directory = Path(
        os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chroma")
    ).resolve()
    persist_directory.mkdir(parents=True, exist_ok=True)

    client = chromadb.PersistentClient(path=str(persist_directory))
    return client.get_or_create_collection(
        name="research_papers",
        metadata={"hnsw:space": "cosine"},
    )
