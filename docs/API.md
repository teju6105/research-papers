# API documentation

## FastAPI vector service

### `GET /health`

Confirms that the FastAPI process is responsive. This is a process health check only; it does not verify connectivity to MySQL, MongoDB, or ChromaDB.

Example response:

```json
{
  "status": "ok",
  "service": "vector-api"
}
```

Run the API from the project root:

```powershell
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Interactive OpenAPI documentation is available at `/docs` while the service is running. The initial ChromaDB collection and lazy Sentence Transformer loader are configured in `backend/app/vector_store.py`. Search, embedding, recommendation, and database-connectivity endpoints will be documented when implemented and tested.

## Next.js authentication routes

These routes use the MySQL `Users` table through Prisma. Configure `DATABASE_URL` and an `AUTH_SECRET` of at least 32 characters in `.env`.

### `POST /api/auth/register`

Request JSON:

```json
{
  "name": "Researcher Name",
  "email": "researcher@example.edu",
  "password": "a-password-of-at-least-8-characters"
}
```

Creates a `USER` account, hashes the password with bcrypt, returns public profile fields, and sets a signed HTTP-only session cookie. Returns `400` for invalid input and `409` if the email already exists.

### `POST /api/auth/login`

Request JSON:

```json
{
  "email": "researcher@example.edu",
  "password": "a-password-of-at-least-8-characters"
}
```

Verifies the bcrypt password hash and sets the session cookie. Invalid credentials return `401`; missing database configuration/connectivity is reported as `503`.

### `GET /api/auth/session`

Verifies the session cookie and returns the signed-in user's public profile fields. Returns `401` if no valid account session exists.

### `POST /api/auth/logout`

Expires the HTTP-only session cookie.

These routes were verified against the configured local MySQL database with `npm run auth:smoke`. See [the SQL guide](./SQL_GUIDE.md) for schema and query examples.

## MongoDB research-paper routes

The paper document APIs use the MongoDB `researchPapers` collection and `paperId` as the cross-database identifier. Configure `MONGODB_URI` and `MONGODB_DATABASE` in `.env`; write routes additionally require the signed-in user to have the MySQL `ADMIN` role.

- `GET /api/papers?page=1&limit=20&category=Ecology` — list newest papers with pagination and optional category.
- `GET /api/papers?q=climate` — MongoDB text-index search. Result relevance ordering uses actual MongoDB text scores.
- `POST /api/papers` — validate and create a paper; admin session required.
- `GET /api/papers/{paperId}` — fetch one paper by its stable ID.
- `PATCH /api/papers/{paperId}` — validate and update provided fields; admin session required.
- `DELETE /api/papers/{paperId}` — delete by ID; admin session required.

Invalid input returns `400`, duplicate IDs `409`, missing papers `404`, and connection/operation errors `503`. See [the MongoDB guide](./MONGODB_GUIDE.md) for the document shape, Atlas setup, sample seed, and `mongosh` operations.
