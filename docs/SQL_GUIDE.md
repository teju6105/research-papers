# MySQL and Prisma SQL guide

## Database design

Prisma models map to these MySQL tables:

| Table | Purpose | Key constraints |
|---|---|---|
| `Users` | Researcher accounts, role, and password hash | Primary key `id`; unique `email` |
| `Papers` | Canonical paper IDs and searchable metadata | Primary key `id` |
| `Bookmarks` | User-to-paper saved-paper relationship | Composite primary key `(user_id, paper_id)`; foreign keys to both parent tables |
| `SearchHistory` | A user's search queries and timestamps | Primary key `id`; foreign key to `Users.id` |

`Papers` is included because a bookmark must reference an existing paper. Paper abstracts and flexible details belong in MongoDB in a later integration stage; they are not duplicated here. ChromaDB is not relational storage.

The full source schema is [`../prisma/schema.prisma`](../prisma/schema.prisma). Prisma maps application camelCase fields to readable table/column names such as `Users`, `password_hash`, and `created_at`.

### Keys, relationships, and timestamps

- Every table has a primary key. `Bookmarks` uses a composite primary key so a user cannot save the same paper twice.
- `Users.email` has a unique constraint; the application also normalizes emails to lowercase before insert and lookup.
- `Bookmarks.user_id` and `Bookmarks.paper_id` are foreign keys. Deleting the parent user or paper cascades to its bookmarks.
- `SearchHistory.user_id` references `Users.id`; deleting the user cascades to that user's search history.
- IDs are `VARCHAR(30)` application-generated CUIDs. Email is `VARCHAR(191)`, password hashes are `VARCHAR(255)`, and timestamps use `DATETIME(3)`.
- `created_at` defaults to the current time. Prisma sets `updated_at` on user/paper creation and updates through `@updatedAt`.

## Apply the schema

1. Create an empty, dedicated MySQL database named `research_papers_shadow` and grant the app user access to it. The helper script configures both `DATABASE_URL` and `SHADOW_DATABASE_URL` with the password you enter. Prisma CLI and Next.js load `.env`; do not paste credentials into source code or commit `.env`.
2. From the project root, run:

   ```powershell
   npm run db:validate
   npm run db:generate
   npm run db:migrate
   npm run db:smoke
   ```

`migrate dev` connects to MySQL and applies the versioned migration under `prisma/migrations/`; it is not run against production databases. If tables already exist, inspect them and choose a safe baseline/migration before applying this initial migration.

Prisma Migrate uses the dedicated `SHADOW_DATABASE_URL` to replay the schema and compare database state. Its user only needs rights within that shadow database; the main account does not need global `CREATE DATABASE` privileges. The shadow database must be separate from the application's data database because migrate dev resets its contents.

`db:smoke` creates temporary uniquely named user, paper, bookmark, and search-history rows; verifies related reads, ordering, counts, updates, and cascade deletion; and removes its test rows.

The checked-in initial migration was generated from `prisma/schema.prisma` using Prisma's schema diff.

## SQL examples

The commands below are MySQL examples for the migrated schema. Run them in a development database. The sample user requires a real bcrypt hash: the application creates it during registration; never store a plaintext password. Example IDs beginning with `demo-` are illustrative and must be unique in the database.

### CREATE

Prisma migrations are the source of truth for table creation. This equivalent abbreviated MySQL DDL shows the relational constraints:

```sql
CREATE TABLE `Users` (
  `id` VARCHAR(30) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_email_key` (`email`)
);

CREATE TABLE `Papers` (
  `id` VARCHAR(30) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `authors` JSON NOT NULL,
  `topic` VARCHAR(120) NOT NULL,
  `keywords` JSON NOT NULL,
  `published_year` SMALLINT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Bookmarks` (
  `user_id` VARCHAR(30) NOT NULL,
  `paper_id` VARCHAR(30) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`, `paper_id`),
  CONSTRAINT `Bookmarks_user_id_fkey` FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bookmarks_paper_id_fkey` FOREIGN KEY (`paper_id`)
    REFERENCES `Papers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `SearchHistory` (
  `id` VARCHAR(30) NOT NULL,
  `user_id` VARCHAR(30) NOT NULL,
  `query` VARCHAR(500) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `SearchHistory_user_id_fkey` FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
```

These are reference DDL statements; do not run them after Prisma has already created the tables. The migration contains the complete indexes and generated SQL for the schema.

### INSERT

This inserts fictional, non-authenticating example catalog data. `@demo_password_hash` must be set to a bcrypt hash generated by the app; do not use a plaintext password or use this SQL to create a real account.

```sql
SET @demo_password_hash = '<bcrypt hash generated by the registration flow>';

INSERT INTO `Users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`)
VALUES ('demo-user-001', 'Sample Researcher', 'sample@example.edu',
        @demo_password_hash, 'USER', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `Papers`
  (`id`, `title`, `authors`, `topic`, `keywords`, `published_year`, `created_at`, `updated_at`)
VALUES
  ('demo-paper-001', 'Fictional Sample: Interpretable Climate Forecasting',
   JSON_ARRAY('Sample Author'), 'Climate science',
   JSON_ARRAY('climate', 'sample data'), 2024, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `Bookmarks` (`user_id`, `paper_id`, `created_at`)
VALUES ('demo-user-001', 'demo-paper-001', CURRENT_TIMESTAMP(3));

INSERT INTO `SearchHistory` (`id`, `user_id`, `query`, `created_at`)
VALUES ('demo-search-001', 'demo-user-001', 'fictional sample climate paper',
        CURRENT_TIMESTAMP(3));
```

The `Users` row is for schema demonstration only. Prefer the registration API to create users because it validates input, hashes passwords, and starts a session.

### SELECT

```sql
SELECT `id`, `name`, `email`, `role`, `created_at`
FROM `Users`
WHERE `email` = 'sample@example.edu';
```

Returns a user's non-secret profile fields. Never include `password_hash` in public API responses.

### UPDATE

```sql
UPDATE `Users`
SET `name` = 'Sample Researcher Updated',
    `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `id` = 'demo-user-001';
```

Updates the display name and modification timestamp. Application updates should use Prisma so `@updatedAt` is applied consistently.

### DELETE

```sql
DELETE FROM `Bookmarks`
WHERE `user_id` = 'demo-user-001'
  AND `paper_id` = 'demo-paper-001';
```

Deletes one saved-paper relationship. The composite primary key identifies exactly one bookmark. Deleting a user also cascades to their bookmarks and search history.

### JOIN

```sql
SELECT u.`name`, p.`title`, b.`created_at` AS `bookmarked_at`
FROM `Bookmarks` AS b
JOIN `Users` AS u ON u.`id` = b.`user_id`
JOIN `Papers` AS p ON p.`id` = b.`paper_id`
WHERE u.`email` = 'sample@example.edu'
ORDER BY b.`created_at` DESC;
```

Combines the user, relationship, and paper rows to list that researcher's saved papers.

### GROUP BY

```sql
SELECT p.`topic`, COUNT(*) AS `bookmark_count`
FROM `Bookmarks` AS b
JOIN `Papers` AS p ON p.`id` = b.`paper_id`
GROUP BY p.`topic`
ORDER BY `bookmark_count` DESC, p.`topic` ASC;
```

Groups bookmarks by topic and counts the rows in each topic.

### ORDER BY

```sql
SELECT `query`, `created_at`
FROM `SearchHistory`
WHERE `user_id` = 'demo-user-001'
ORDER BY `created_at` DESC, `id` DESC
LIMIT 20;
```

Shows the most recent 20 searches for a user. The tie-breaker makes results stable when timestamps are equal.

### Aggregate queries

```sql
SELECT
  COUNT(*) AS `user_count`,
  COUNT(DISTINCT `role`) AS `role_count`,
  MIN(`created_at`) AS `first_registration`,
  MAX(`created_at`) AS `latest_registration`
FROM `Users`;

SELECT
  COUNT(*) AS `bookmark_count`,
  COUNT(DISTINCT `user_id`) AS `researchers_with_bookmarks`
FROM `Bookmarks`;

SELECT
  `user_id`,
  COUNT(*) AS `search_count`,
  MAX(`created_at`) AS `last_search_at`
FROM `SearchHistory`
GROUP BY `user_id`
ORDER BY `search_count` DESC;
```

`COUNT`, `COUNT(DISTINCT ...)`, `MIN`, and `MAX` summarize the tables without returning individual rows.

## Registration and login operations

- `POST /api/auth/register` validates name/email/password, normalizes email, hashes the password using bcrypt, inserts a `Users` row with the default `USER` role, and sets a signed HTTP-only session cookie.
- `POST /api/auth/login` looks up the normalized unique email, checks the submitted password against the stored bcrypt hash, and sets the session cookie on success.
- `GET /api/auth/session` verifies the signed cookie and returns only public user fields.
- `POST /api/auth/logout` clears the session cookie.
- Registration never accepts a caller-selected role. Password hashes are excluded from API responses.

## Stage 3 verification record

- `npm run db:validate` — passed against the configured project.
- `npm run db:generate` — passed; Prisma Client generated.
- `npm run db:migrate` — passed; migration `20261101210300_init` applied to the configured local MySQL database.
- `npm run db:smoke` — passed against MySQL; verified inserts, related reads, ordering, grouping/counts, timestamp update, deletes, and cascading foreign keys. Temporary rows were cleaned up.
- `npm run auth:smoke` — passed against the running application and MySQL; verified registration, duplicate-email rejection, session cookie lookup, wrong-password rejection, login, logout, and cleanup.
- `npm run lint` and `npm run build` — passed.
- Correction: the migration and smoke tests have now completed successfully against MySQL. The older pending-setup note below is superseded by these verified results.
- `npm run db:migrate` and `npm run db:smoke` — **not run against MySQL** because no `.env` file or `DATABASE_URL` is configured in this workspace. The smoke-test script stops with an explicit setup message. A MySQL service listening on port 3306 does not verify credentials or database operations.

The migration and smoke-test results above were verified on the configured local database. Do not copy real credentials into project files or chat.
