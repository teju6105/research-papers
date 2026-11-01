import type { Metadata } from "next";
import { SearchExplorer } from "@/components/search-explorer";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Discover papers",
};

export default function SearchPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="eyebrow">Explore the sample catalog</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Discover research
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Search titles, authors, topics, and keywords. The records on this
          page are clearly labeled examples for the frontend preview.
        </p>
      </div>
      <SearchExplorer />
    </AppShell>
  );
}
