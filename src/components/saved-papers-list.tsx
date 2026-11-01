"use client";

import { useEffect, useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { samplePapers } from "@/lib/sample-papers";

const STORAGE_KEY = "research-atlas-preview-saved";
const CHANGE_EVENT = "research-atlas-saved-change";

function readSavedIds(): string[] {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function SavedPapersList() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const updateSavedIds = () => setSavedIds(readSavedIds());
    updateSavedIds();
    window.addEventListener(CHANGE_EVENT, updateSavedIds);
    window.addEventListener("storage", updateSavedIds);
    return () => {
      window.removeEventListener(CHANGE_EVENT, updateSavedIds);
      window.removeEventListener("storage", updateSavedIds);
    };
  }, []);

  const savedPapers = samplePapers.filter((paper) => savedIds.includes(paper.id));

  if (savedPapers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-800">
          <Bookmark size={20} />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          Your reading list starts here
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Save a sample paper using its bookmark button. Saved items are kept in
          this browser for the UI preview only.
        </p>
        <a href="/search" className="button-primary mt-5">
          <Search size={16} /> Explore sample papers
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Saved in this browser preview · {savedPapers.length}{" "}
        {savedPapers.length === 1 ? "paper" : "papers"}
      </p>
      {savedPapers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
