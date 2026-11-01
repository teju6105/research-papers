# MongoDB research paper documents

## Database and collection

- Database: `research_papers` (selected by `MONGODB_DATABASE`)
- Collection: `researchPapers`
- MongoDB is the source of truth for paper abstracts and flexible descriptive details. MySQL remains responsible for user accounts, roles, bookmarks, search history, and relational paper identity/core metadata. MongoDB `paperId` is the canonical cross-store identifier. ChromaDB will store vectors in its own later stage.

Each document has a unique string `paperId`, `title`, `authors`, `abstract`, `keywords`, `researchCategory`, `publicationYear`, `journalOrConference`, nullable `doi`, nullable `externalPaperUrl`, nullable `pdfUrl`, and a server-created `createdAt` timestamp. Seed records also have `isSample: true` and a visible `[FICTIONAL SAMPLE]` title prefix. These are invented examples, not published research or search results.

## Configure MongoDB

This project uses MongoDB Atlas. Create a cluster and database user in Atlas, allow your development IP address in Network Access, and copy the Atlas driver URI. In the project PowerShell terminal, run:

```powershell
.\scripts\set-mongodb-uri.ps1
```

Paste the Atlas URI at the hidden prompt. It is saved to the private `.env`; it is not printed. The database name is set to `research_papers`. Never commit `.env` or paste the URI/password into chat. The Atlas user must have read/write access to the database and permission to create indexes.

## Seed clearly labeled sample documents

The source data is [`../data/sample-research-papers.json`](../data/sample-research-papers.json), containing 20 explicitly labeled fictional documents.

```powershell
npm run mongo:seed
```

Seeding creates the collection indexes and uses an upsert keyed by `paperId`, so re-running it updates the same sample records rather than inserting duplicates. It does not delete unrelated documents.

## API endpoints

Write endpoints require a signed-in MySQL user with the `ADMIN` role.

| Method and path | Operation |
|---|---|
| `POST /api/papers` | Validate and add a paper; creates `createdAt` on the server |
| `GET /api/papers` | List papers, newest first; accepts `page`, `limit` (1–100), and optional `category` |
| `GET /api/papers?q=climate` | MongoDB `$text` search across title, authors, abstract, keywords, category, and venue |
| `GET /api/papers/{paperId}` | Fetch a paper by canonical paper ID |
| `PATCH /api/papers/{paperId}` | Validate and update the provided fields; paper ID and creation timestamp are immutable |
| `DELETE /api/papers/{paperId}` | Delete one paper |

Validation errors return `400`; duplicate IDs return `409`; missing IDs return `404`; MongoDB connection/operation errors are logged server-side and return `503`. MongoDB text-search result order is sorted using MongoDB's actual `$meta: "textScore"` value; the API does not invent a score.

### Example API requests

Add a record (use an admin-authenticated session):

```http
POST /api/papers
Content-Type: application/json

{
  "paperId": "course-paper-001",
  "title": "[FICTIONAL SAMPLE] Example paper title",
  "authors": ["Sample Author"],
  "abstract": "FICTIONAL TEST ABSTRACT. This record is invented for coursework.",
  "keywords": ["fictional sample", "database"],
  "researchCategory": "Database Systems",
  "publicationYear": 2026,
  "journalOrConference": "Fictional Sample Proceedings",
  "doi": null,
  "externalPaperUrl": null,
  "pdfUrl": null,
  "isSample": true
}
```

```http
GET /api/papers?q=database
GET /api/papers/course-paper-001
PATCH /api/papers/course-paper-001
Content-Type: application/json

{"journalOrConference":"Fictional Updated Venue"}
```

```http
DELETE /api/papers/course-paper-001
```

## MongoDB shell commands (mongosh)

Select the application database and collection:

```javascript
use research_papers
const papers = db.getCollection("researchPapers")
```

### Indexes

The application creates these indexes when its paper API first opens the collection; `mongo:seed` also ensures them.

```javascript
db.researchPapers.createIndex(
  { paperId: 1 },
  { unique: true, name: "paperId_unique" }
)

db.researchPapers.createIndex(
  {
    title: "text",
    authors: "text",
    abstract: "text",
    keywords: "text",
    researchCategory: "text",
    journalOrConference: "text"
  },
  { name: "researchPapers_text_search" }
)

db.researchPapers.createIndex(
  { researchCategory: 1, publicationYear: -1 },
  { name: "researchPapers_category_year" }
)
```

The unique index prevents duplicate canonical paper IDs. The text index enables word search across the academic text fields; the category/year compound index supports common browsing filters and sorting.

### INSERT

Insert one explicitly fictional sample document. `createdAt` records when this document was added to the collection.

```javascript
db.researchPapers.insertOne({
  paperId: "manual-sample-001",
  title: "[FICTIONAL SAMPLE] Insert command demonstration",
  authors: ["Sample Author"],
  abstract: "FICTIONAL TEST ABSTRACT. This invented document demonstrates MongoDB insertOne.",
  keywords: ["fictional sample", "MongoDB"],
  researchCategory: "Database Systems",
  publicationYear: 2026,
  journalOrConference: "Fictional Sample Venue",
  doi: null,
  externalPaperUrl: null,
  pdfUrl: null,
  isSample: true,
  createdAt: new Date()
})
```

### FIND

```javascript
// Find one document by its canonical paper ID.
db.researchPapers.findOne({ paperId: "manual-sample-001" })

// Find recent papers in one category with a bounded result set.
db.researchPapers
  .find({ researchCategory: "Database Systems" })
  .sort({ createdAt: -1, paperId: 1 })
  .limit(20)

// Full-text search with MongoDB's measured text relevance metadata.
db.researchPapers
  .find(
    { $text: { $search: "fictional MongoDB insert" } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
```

### UPDATE

```javascript
db.researchPapers.updateOne(
  { paperId: "manual-sample-001" },
  { $set: { journalOrConference: "Fictional Updated Venue" } }
)
```

`updateOne` changes the matching record while preserving fields that were not named in `$set`. The API forbids changes to `paperId` and `createdAt`.

### DELETE

```javascript
db.researchPapers.deleteOne({ paperId: "manual-sample-001" })
```

`deleteOne` removes a single document by its unique paper ID. The UI/API reports not-found when no document was removed.

### AGGREGATION

Count documents per category and calculate the publication-year range:

```javascript
db.researchPapers.aggregate([
  {
    $group: {
      _id: "$researchCategory",
      paperCount: { $sum: 1 },
      earliestYear: { $min: "$publicationYear" },
      latestYear: { $max: "$publicationYear" }
    }
  },
  { $sort: { paperCount: -1, _id: 1 } }
])
```

This pipeline groups documents by category, calculates count/minimum/maximum values, and sorts the computed groups. Sample documents are included unless filtered out explicitly:

```javascript
db.researchPapers.aggregate([
  { $match: { isSample: { $ne: true } } },
  { $group: { _id: "$researchCategory", paperCount: { $sum: 1 } } },
  { $sort: { paperCount: -1 } }
])
```

## Testing

```powershell
npm run mongo:seed
npm run start
```

In another terminal, with `.env` present:

```powershell
npm run mongo:smoke
```

The smoke test creates a temporary admin in MySQL and a uniquely named MongoDB document; exercises unauthorized-write denial, create, list, get-by-ID, text search, update, delete, and not-found; and removes temporary test records. It expects the production Next.js server at `http://127.0.0.1:3000` (override with `MONGODB_TEST_BASE_URL`).

## Stage 4 verification record

Live operation results will be recorded after Atlas is configured and the seed/API smoke commands above have been run. A local Mongo URI has not yet been configured for this project.
