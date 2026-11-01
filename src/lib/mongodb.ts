import { Collection, Db, MongoClient } from "mongodb";
import type { ResearchPaperDocument } from "@/lib/research-paper";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
  paperIndexesPromise?: Promise<void>;
};

export async function getMongoDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DATABASE;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URI and MONGODB_DATABASE must be configured.");
  }

  // Reuse the connection pool during development hot reloads.
  globalForMongo.mongoClientPromise ??= new MongoClient(uri).connect().catch((error) => {
    globalForMongo.mongoClientPromise = undefined;
    throw error;
  });

  return (await globalForMongo.mongoClientPromise).db(databaseName);
}

export async function getResearchPapersCollection(): Promise<
  Collection<ResearchPaperDocument>
> {
  const database = await getMongoDatabase();
  const collection =
    database.collection<ResearchPaperDocument>("researchPapers");

  globalForMongo.paperIndexesPromise ??= Promise.all([
    collection.createIndex({ paperId: 1 }, { unique: true, name: "paperId_unique" }),
    collection.createIndex(
      {
        title: "text",
        authors: "text",
        abstract: "text",
        keywords: "text",
        researchCategory: "text",
        journalOrConference: "text",
      },
      { name: "researchPapers_text_search" },
    ),
    collection.createIndex(
      { researchCategory: 1, publicationYear: -1 },
      { name: "researchPapers_category_year" },
    ),
  ])
    .then(() => undefined)
    .catch((error) => {
      globalForMongo.paperIndexesPromise = undefined;
      throw error;
    });

  await globalForMongo.paperIndexesPromise;
  return collection;
}
