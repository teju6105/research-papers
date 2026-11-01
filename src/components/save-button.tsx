"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "research-atlas-preview-saved";
const CHANGE_EVENT = "research-atlas-saved-change";

function readSavedIds(): string[] {
  try {
    const savedIds: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(savedIds)
      ? savedIds.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function SaveButton({ paperId }: { paperId: string }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const updateSavedState = () => setIsSaved(readSavedIds().includes(paperId));
    updateSavedState();
    window.addEventListener(CHANGE_EVENT, updateSavedState);
    window.addEventListener("storage", updateSavedState);
    return () => {
      window.removeEventListener(CHANGE_EVENT, updateSavedState);
      window.removeEventListener("storage", updateSavedState);
    };
  }, [paperId]);

  function toggleSaved() {
    const savedIds = readSavedIds();
    const nextSavedIds = isSaved
      ? savedIds.filter((id) => id !== paperId)
      : [...new Set([...savedIds, paperId])];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSavedIds));
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-label={isSaved ? "Remove from saved papers" : "Save paper"}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from saved papers" : "Save paper"}
      className={`grid size-9 shrink-0 place-items-center rounded-lg border transition ${
        isSaved
          ? "border-blue-200 bg-blue-50 text-blue-800"
          : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-800"
      }`}
    >
      <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
}
