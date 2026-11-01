import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and configure MySQL first.",
  );
}

const prisma = new PrismaClient();
const uniqueId = randomUUID().replaceAll("-", "");
const email = `stage3-smoke-${uniqueId}@example.invalid`;
let userId;
let paperId;

try {
  const passwordHash = await bcrypt.hash(randomUUID(), 4);
  const user = await prisma.user.create({
    data: {
      name: "Stage 3 database smoke test",
      email,
      passwordHash,
    },
  });
  userId = user.id;
  console.log("PASS INSERT user");

  const paper = await prisma.paper.create({
    data: {
      title: "Fictional database smoke-test paper",
      authors: ["Smoke Test Author"],
      topic: "Database testing",
      keywords: ["sample", "smoke-test"],
      publishedYear: 2026,
    },
  });
  paperId = paper.id;
  console.log("PASS INSERT paper");

  await prisma.bookmark.create({
    data: { userId: user.id, paperId: paper.id },
  });
  await prisma.searchHistory.create({
    data: { userId: user.id, query: "database smoke-test query" },
  });

  const joinedProfile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { bookmarks: { include: { paper: true } }, searchHistory: true },
  });
  if (
    joinedProfile.bookmarks[0]?.paper.id !== paper.id ||
    joinedProfile.searchHistory[0]?.query !== "database smoke-test query"
  ) {
    throw new Error("Related bookmark/search rows did not match the test user.");
  }
  console.log("PASS SELECT and JOIN user, bookmark, paper, and search history");

  const orderedHistory = await prisma.searchHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  if (orderedHistory.length !== 1) {
    throw new Error("Search-history ORDER BY verification failed.");
  }
  console.log("PASS ORDER BY search history");

  const groupedBookmarks = await prisma.bookmark.groupBy({
    by: ["paperId"],
    where: { userId: user.id },
    _count: { _all: true },
  });
  if (groupedBookmarks[0]?._count._all !== 1) {
    throw new Error("Bookmark aggregate verification failed.");
  }
  console.log("PASS GROUP BY and COUNT bookmarks");

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { name: "Stage 3 database smoke test updated" },
  });
  if (
    updatedUser.name !== "Stage 3 database smoke test updated" ||
    updatedUser.updatedAt < user.updatedAt
  ) {
    throw new Error("User UPDATE or updatedAt verification failed.");
  }
  console.log("PASS UPDATE user and updatedAt");

  await prisma.user.delete({ where: { id: user.id } });
  userId = undefined;
  const [remainingBookmarks, remainingHistory] = await Promise.all([
    prisma.bookmark.count({ where: { paperId: paper.id } }),
    prisma.searchHistory.count({ where: { userId: user.id } }),
  ]);
  if (remainingBookmarks !== 0 || remainingHistory !== 0) {
    throw new Error("User deletion did not cascade to dependent rows.");
  }
  console.log("PASS DELETE user and cascading foreign keys");

  await prisma.paper.delete({ where: { id: paper.id } });
  paperId = undefined;
  console.log("PASS DELETE paper");
  console.log("MySQL database smoke test passed.");
} finally {
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  if (paperId) {
    await prisma.paper.deleteMany({ where: { id: paperId } });
  }
  await prisma.$disconnect();
}
