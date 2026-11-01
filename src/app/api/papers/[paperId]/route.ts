import { NextRequest, NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { requireAdmin } from "@/lib/api-admin";
import { getResearchPapersCollection } from "@/lib/mongodb";
import { researchPaperUpdateSchema } from "@/lib/research-paper";

type PaperRouteContext = {
  params: Promise<{ paperId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: PaperRouteContext,
) {
  const { paperId } = await context.params;
  try {
    const collection = await getResearchPapersCollection();
    const paper = await collection.findOne({ paperId });
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
    }
    return NextResponse.json({ paper });
  } catch (error) {
    console.error("MongoDB paper lookup failed.", error);
    return NextResponse.json(
      { error: "The research paper is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: PaperRouteContext,
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { paperId } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = researchPaperUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paper update is invalid.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const collection = await getResearchPapersCollection();
    const result = await collection.findOneAndUpdate(
      { paperId },
      { $set: parsed.data },
      { returnDocument: "after" },
    );
    if (!result) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
    }
    return NextResponse.json({ paper: result });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "The update conflicts with an existing paper." },
        { status: 409 },
      );
    }
    console.error("MongoDB paper update failed.", error);
    return NextResponse.json(
      { error: "The paper could not be updated." },
      { status: 503 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: PaperRouteContext,
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { paperId } = await context.params;
  try {
    const collection = await getResearchPapersCollection();
    const result = await collection.deleteOne({ paperId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
    }
    return NextResponse.json({ deleted: true, paperId });
  } catch (error) {
    console.error("MongoDB paper deletion failed.", error);
    return NextResponse.json(
      { error: "The paper could not be deleted." },
      { status: 503 },
    );
  }
}
