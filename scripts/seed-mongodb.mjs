import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
if (!uri || !databaseName || /USER:PASSWORD|HOST|placeholder|replace/i.test(uri)) {
  throw new Error(
    "Configure a real MONGODB_URI and MONGODB_DATABASE in .env before seeding.",
  );
}

const samplePath = new URL("../data/sample-research-papers.json", import.meta.url);
const samples = JSON.parse(await readFile(samplePath, "utf8"));
if (samples.length < 20 || samples.some((paper) => paper.isSample !== true)) {
  throw new Error("Seed file must contain at least 20 explicitly labeled sample papers.");
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const collection = client
    .db(databaseName)
    .collection("researchPapers");

  await collection.createIndexes([
    { key: { paperId: 1 }, name: "paperId_unique", unique: true },
    {
      key: {
        title: "text",
        authors: "text",
        abstract: "text",
        keywords: "text",
        researchCategory: "text",
        journalOrConference: "text",
      },
      name: "researchPapers_text_search",
    },
    {
      key: { researchCategory: 1, publicationYear: -1 },
      name: "researchPapers_category_year",
    },
  ]);

  const operations = samples.map((paper) => ({
    updateOne: {
      filter: { paperId: paper.paperId },
      update: {
        $set: paper,
        $setOnInsert: { createdAt: new Date() },
      },
      upsert: true,
    },
  }));
  const result = await collection.bulkWrite(operations, { ordered: true });

  console.log(
    `Seed complete: ${samples.length} fictional sample papers; ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`,
  );
} finally {
  await client.close();
}
