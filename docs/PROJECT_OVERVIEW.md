# Project overview

## Abstract

The Research Paper Recommendation System is a planned academic discovery application for students and researchers. It will combine structured paper metadata search with semantic retrieval to help users find publications relevant to a query or topic. The project uses relational, document, and vector databases so each data store has a clearly explained role. Authentication, search, recommendations, and administration will be implemented and verified in later development stages.

## Technology stack

| Area | Technology |
|---|---|
| Web UI | Next.js App Router, TypeScript, Tailwind CSS, Lucide React |
| Web API | Next.js route handlers |
| Vector API | Python FastAPI |
| Relational database | MySQL with Prisma ORM |
| Document database | MongoDB Atlas |
| Vector database | ChromaDB |
| Embeddings | Sentence Transformers `all-MiniLM-L6-v2` |

## Database architecture

- **MySQL** owns users, roles, canonical paper identifiers and core metadata, bookmarks, and search history. The initial Prisma schema is in `../prisma/schema.prisma`.
- **MongoDB** stores abstracts and flexible paper descriptions, linked using the canonical paper identifier. Its connection helper is `../src/lib/mongodb.ts`.
- **ChromaDB** stores generated paper-text embeddings and their identifiers for semantic retrieval. It is not the source of truth for user or paper metadata. Its persistent collection and lazy model setup are in `../backend/app/vector_store.py`.
- The application services will coordinate writes and report failures explicitly. Cross-database consistency and recovery behavior will be documented when integration is implemented.

## Initial folder structure

```text
backend/
  app/
    main.py
  requirements.txt
docs/
  API.md
  PROJECT_OVERVIEW.md
src/
  app/
    layout.tsx
    page.tsx
.env.example
README.md
```

The structure will be updated as features are added.

## Setup notes

See the root [README](../README.md) for requirements and local run instructions. Credentials belong in an untracked local environment file, not frontend code.

The sample environment template is `.env.example`. Copy it to `.env` and replace placeholders locally; Next.js and Prisma CLI both load it. Connection helpers validate required MongoDB settings when called. The vector service loads Sentence Transformers and initializes ChromaDB only when a vector operation calls the helpers; `/health` is not a database connectivity check.

## SQL, MongoDB, ChromaDB, screenshots, and testing

MySQL DDL and SQL examples for `CREATE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`, `ORDER BY`, and aggregate queries are in [the SQL guide](./SQL_GUIDE.md). Migration and live database test outcomes are recorded only after a configured MySQL connection is available. MongoDB, ChromaDB, screenshots, and later test results will be documented with their corresponding implementation stages.
