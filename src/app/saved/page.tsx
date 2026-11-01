import type { Metadata } from "next";
import { Bookmark, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SavedPapersList } from "@/components/saved-papers-list";

export const metadata: Metadata = {
  title: "Saved papers",
};

export default function SavedPapersPage() {
  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            <Bookmark size={14} /> Your reading list
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Saved papers
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep interesting sample papers close while you explore.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500">
          <ShieldCheck size={14} /> Stored in this browser only
        </span>
      </div>
      <div className="mt-6">
        <SavedPapersList />
      </div>
    </AppShell>
  );
}
