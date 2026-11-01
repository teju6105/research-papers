import { NextRequest, NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { requireAdmin } from "@/lib/api-admin";
import { getResearchPapersCollection } from "@/lib/mongodb";
import { researchPaperInputSchema } from "@/lib/research-paper";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const category = request.nextUrl.searchParams.get("category")?.trim();
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(
    request.nextUrl.searchParams.get("limit") ?? DEFAULT_PAGE_SIZE,
  );

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json({ error: "page must be a positive integer." }, { status: 400 });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    return NextResponse.json(
      { error: `limit must be an integer between 1 and ${MAX_PAGE_SIZE}.` },
      { status: 400 },
    );
  }

  try {
    const collection = await getResearchPapersCollection();
    const filter: Record<string, unknown> = {};
    if (category) filter.researchCategory = category;
    if (query) filter.$text = { $search: query };

    const total = await collection.countDocuments(filter);
    const cursor = collection.find(filter);
    if (query) {
      cursor.project({ score: { $meta: "textScore" } });
      cursor.sort({ score: { $meta: "textScore" }, createdAt: -1 });
    } else {
      cursor.sort({ createdAt: -1, paperId: 1 });
    }

    const papers = await cursor
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      papers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      searchMode: query ? "mongodb-text-index" : "browse",
    });
  } catch (error) {
    console.error("MongoDB paper list/search failed.", error);
    return NextResponse.json(
      { error: "Research papers are temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = researchPaperInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paper data is invalid.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const collection = await getResearchPapersCollection();
    const document = { ...parsed.data, createdAt: new Date() };
    await collection.insertOne(document);
    return NextResponse.json({ paper: document }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "A paper with that paperId already exists." },
        { status: 409 },
      );
    }
    console.error("MongoDB paper creation failed.", error);
    return NextResponse.json(
      { error: "The paper could not be created." },
      { status: 503 },
    );
  }
}
