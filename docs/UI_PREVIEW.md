# Frontend preview

## Routes

| Route | Preview |
|---|---|
| `/` | Landing page and entry points |
| `/login` | Sign-in form connected to the MySQL authentication API |
| `/register` | Account creation form connected to the MySQL authentication API |
| `/dashboard` | Research workspace overview |
| `/search` | Local search and category, author, and year filters over sample records |
| `/papers/[id]` | Details for a fictional sample record |
| `/saved` | Browser-local list of bookmarked sample records |
| `/admin` | Admin catalog preview; write controls are disabled |

The dashboard shell includes responsive sidebar navigation. Paper cards link to detail pages; landing calls to action and the authentication forms link to their corresponding routes. Authentication routes require the MySQL migration and local environment variables.

## Preview data and behavior

All sample records live in `src/lib/sample-papers.ts`. The records and abstracts are fictional, are labeled in the interface, and must not be presented as real publications or search results.

The search input and category, author, and publication-year filters operate locally on those records. The save button stores sample paper IDs in browser `localStorage`; it is not connected to a user account or database. Login and registration forms call the MySQL-backed API. Admin write controls remain disabled.

## Verification

Stage 2 verification:

- `npm run lint` — passed.
- `npm run build` — passed; all requested pages were generated.
- Production HTTP smoke checks — passed for `/`, `/login`, `/register`, `/dashboard`, `/search`, one sample paper details route, `/saved`, and `/admin`.
- Navigation markup checks — passed for dashboard links to overview, search, saved papers, and admin; sample search result links to its paper details route.

No live database, authentication, semantic search, or recommendation behavior is asserted by these UI checks.
