import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
const authSecret = process.env.AUTH_SECRET;
const baseUrl = process.env.MONGODB_TEST_BASE_URL ?? "http://127.0.0.1:3000";

if (
  !uri ||
  !databaseName ||
  /USER:PASSWORD|HOST|placeholder|replace/i.test(uri)
) {
  throw new Error(
    "Configure a real MONGODB_URI and MONGODB_DATABASE in .env before testing.",
  );
}
if (!process.env.DATABASE_URL || !authSecret || authSecret.length < 32) {
  throw new Error("DATABASE_URL and a 32+ character AUTH_SECRET are required for API authorization.");
}

const mongoClient = new MongoClient(uri);
const prisma = new PrismaClient();
const randomId = randomUUID().replaceAll("-", "");
const email = `mongo-api-smoke-${randomId}@example.invalid`;
const paperId = `mongo-api-smoke-${randomId}`;
const passwordHash = "smoke-test-only-not-a-real-password-hash";
let adminId;
let collection;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, { method = "GET", body, cookie } = {}) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function responseJson(response) {
  return response.json();
}

try {
  await mongoClient.connect();
  collection = mongoClient.db(databaseName).collection("researchPapers");

  const admin = await prisma.user.create({
    data: {
      name: "Temporary MongoDB API smoke-test admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
    select: { id: true },
  });
  adminId = admin.id;

  const signingKey = new TextEncoder().encode(authSecret);
  const token = await new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(signingKey);
  const cookie = `research_atlas_session=${token}`;

  const unauthenticatedCreate = await request("/api/papers", {
    method: "POST",
    body: { paperId, title: "Unauthorized fictional paper" },
  });
  assert(unauthenticatedCreate.status === 401, "Unauthenticated create was not rejected.");
  console.log("PASS writes require an admin session");

  const input = {
    paperId,
    title: `[FICTIONAL SAMPLE] Mongo API test ${randomId}`,
    authors: ["Temporary Test Author"],
    abstract: `FICTIONAL TEST ABSTRACT. unique searchable phrase ${randomId} for Mongo text-index API verification.`,
    keywords: ["fictional sample", "MongoDB", randomId],
    researchCategory: "Database Testing",
    publicationYear: 2026,
    journalOrConference: "Fictional MongoDB API Test Venue",
    doi: null,
    externalPaperUrl: null,
    pdfUrl: null,
    isSample: true,
  };

  const create = await request("/api/papers", {
    method: "POST",
    body: input,
    cookie,
  });
  assert(create.status === 201, `Create returned HTTP ${create.status}.`);
  const createdBody = await responseJson(create);
  assert(createdBody.paper.paperId === paperId, "Created paper ID does not match.");
  console.log("PASS CREATE research paper");

  const list = await request(`/api/papers?limit=100`);
  assert(list.status === 200, `List returned HTTP ${list.status}.`);
  const listBody = await responseJson(list);
  assert(listBody.papers.some((paper) => paper.paperId === paperId), "Created paper missing from list.");
  console.log("PASS GET all papers with pagination");

  const get = await request(`/api/papers/${encodeURIComponent(paperId)}`);
  assert(get.status === 200, `Get by ID returned HTTP ${get.status}.`);
  assert((await responseJson(get)).paper.title === input.title, "Get-by-ID title did not match.");
  console.log("PASS GET paper by ID");

  const search = await request(`/api/papers?q=${encodeURIComponent(randomId)}`);
  assert(search.status === 200, `Text search returned HTTP ${search.status}.`);
  const searchBody = await responseJson(search);
  assert(
    searchBody.searchMode === "mongodb-text-index" &&
      searchBody.papers.some((paper) => paper.paperId === paperId),
    "MongoDB text-index search did not return the matching paper.",
  );
  console.log("PASS text search across indexed text fields");

  const update = await request(`/api/papers/${encodeURIComponent(paperId)}`, {
    method: "PATCH",
    body: { journalOrConference: "Fictional Updated Test Venue" },
    cookie,
  });
  assert(update.status === 200, `Update returned HTTP ${update.status}.`);
  assert(
    (await responseJson(update)).paper.journalOrConference === "Fictional Updated Test Venue",
    "Updated value did not match.",
  );
  console.log("PASS UPDATE research paper");

  const remove = await request(`/api/papers/${encodeURIComponent(paperId)}`, {
    method: "DELETE",
    cookie,
  });
  assert(remove.status === 200, `Delete returned HTTP ${remove.status}.`);
  const afterDelete = await request(`/api/papers/${encodeURIComponent(paperId)}`);
  assert(afterDelete.status === 404, `Deleted paper lookup returned HTTP ${afterDelete.status}.`);
  console.log("PASS DELETE research paper and verify not found");
} finally {
  if (collection) {
    await collection.deleteOne({ paperId });
  }
  if (adminId) {
    await prisma.user.deleteMany({ where: { id: adminId } });
  }
  await Promise.all([mongoClient.close(), prisma.$disconnect()]);
}

console.log("MongoDB API smoke test passed.");
