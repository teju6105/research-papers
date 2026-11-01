# Research Paper Recommendation System

A college DBMS project for discovering academic papers by metadata and semantic similarity. The application is being developed in stages; database-backed features will be documented and tested as they are implemented.

## Project status

The project includes a responsive frontend preview and a MySQL/Prisma schema with registration and login endpoints. The initial Prisma migration is generated; applying it and verifying live database operations require a configured local MySQL connection.

## Technology stack

- **Web application:** Next.js App Router, TypeScript, Tailwind CSS, Lucide React
- **API services:** Next.js route handlers and Python FastAPI
- **Relational data:** MySQL accessed through Prisma ORM
- **Document data:** MongoDB Atlas
- **Vector search:** ChromaDB with Sentence Transformers `all-MiniLM-L6-v2`

## Database responsibilities

- **MySQL / Prisma:** user accounts, roles, paper IDs and core metadata, bookmarks, and search history (`prisma/schema.prisma`).
- **MongoDB:** abstracts and flexible paper details, associated by the canonical paper ID (`src/lib/mongodb.ts`).
- **ChromaDB:** persistent vector collection for paper embeddings (`backend/app/vector_store.py`).

The databases have separate responsibilities. Similarity values will come from actual vector-search results; no score will be fabricated.

## Frontend preview

The current UI includes a landing page, sign-in and registration, researcher dashboard, sample catalog search with local filters, sample paper details, browser-only saved papers, and an admin dashboard preview. Every paper shown is fictional sample data and visibly labeled. Search and filters run only against the bundled preview records; admin controls are not connected.

See [frontend preview notes and route checks](docs/UI_PREVIEW.md).

## Requirements

- Node.js and npm
- Python 3.11 (recommended for the machine-learning dependencies)
- MySQL 8.0 with a development database and credentials
- A MongoDB Atlas cluster and connection URI
- Python dependencies from `backend/requirements.txt`

ChromaDB will use local persistent storage during development; Docker is not required for that setup.

## Local setup

1. Run `.\scripts\setup-local-env.ps1` in PowerShell. It securely prompts for your MySQL app password and creates `.env` without displaying the password. Prisma CLI and Next.js both load this file. Keep `.env` private.
2. Install web dependencies and generate the Prisma Client:

   ```powershell
   npm install
   npm run db:validate
   npm run db:generate
   npm run db:migrate
   ```
3. Create and activate a Python environment, then install API dependencies:

   ```powershell
   py -3.11 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r backend\requirements.txt
   ```

4. Start the web app in one terminal:

   ```powershell
   npm run dev
   ```

5. Start the API in another terminal:

   ```powershell
   python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
   ```

6. Once the API is running, its health endpoint is `http://127.0.0.1:8000/health` and interactive API docs are at `http://127.0.0.1:8000/docs`.

The vector service's health endpoint checks that the API process is responsive; it does not connect to databases or download the embedding model. ChromaDB creates its persistent collection and the Sentence Transformers model is loaded only when the corresponding Python helpers are called. Configure valid database credentials before testing live connections.

## MySQL registration and login

The Prisma schema is in `prisma/schema.prisma`. Prisma Migrate uses a separate `research_papers_shadow` database to calculate changes safely. Create this empty database and grant `research_app` access to it; the environment helper configures `SHADOW_DATABASE_URL`. The initial migration and CRUD smoke test have been run against the configured local MySQL instance. Registration and login are implemented at `POST /api/auth/register` and `POST /api/auth/login`; they hash passwords with bcrypt and issue an HTTP-only signed session cookie. See the [SQL guide](docs/SQL_GUIDE.md) for schema explanations, migration instructions, and MySQL query examples.

## MongoDB research paper documents

Set the private Atlas URI with `.\scripts\set-mongodb-uri.ps1`, seed 20 fictional sample records with `npm run mongo:seed`, and see [the MongoDB guide](docs/MONGODB_GUIDE.md) for API, shell commands, and operation tests. The MongoDB API smoke test requires the Next.js server to be running with an `ADMIN` test account created and removed by the test script.

## Documentation

- [Project overview and architecture](docs/PROJECT_OVERVIEW.md)
- [API documentation](docs/API.md)
- [SQL and Prisma guide](docs/SQL_GUIDE.md)
- [MongoDB integration guide](docs/MONGODB_GUIDE.md)

MongoDB, ChromaDB, screenshots, and their test-result documentation will be added alongside the corresponding implementation stages.
