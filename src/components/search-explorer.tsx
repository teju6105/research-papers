"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { samplePapers } from "@/lib/sample-papers";

export function SearchExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [author, setAuthor] = useState("All authors");
  const [year, setYear] = useState("All years");

  const topics = useMemo(
    () => [...new Set(samplePapers.map((paper) => paper.topic))],
    [],
  );
  const authors = useMemo(
    () => [...new Set(samplePapers.flatMap((paper) => paper.authors))].sort(),
    [],
  );

  const filteredPapers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return samplePapers.filter((paper) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          paper.title,
          paper.topic,
          paper.journal,
          paper.abstract,
          ...paper.authors,
          ...paper.keywords,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        category === "All topics" || paper.topic === category;
      const matchesAuthor =
        author === "All authors" || paper.authors.includes(author);
      const matchesYear = year === "All years" || paper.year.toString() === year;
      return matchesQuery && matchesCategory && matchesAuthor && matchesYear;
    });
  }, [author, category, query, year]);

  function clearFilters() {
    setCategory("All topics");
    setAuthor("All authors");
    setYear("All years");
    setQuery("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <SlidersHorizontal size={16} /> Filters
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-blue-800 hover:text-blue-950"
          >
            Reset
          </button>
        </div>
        <label className="mt-5 block text-xs font-semibold text-slate-700">
          Category
          <select
            className="input-field mt-2"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All topics</option>
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-xs font-semibold text-slate-700">
          Author
          <select
            className="input-field mt-2"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          >
            <option>All authors</option>
            {authors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-xs font-semibold text-slate-700">
          Publication year
          <select
            className="input-field mt-2"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <option>All years</option>
            {[...new Set(samplePapers.map((paper) => paper.year))]
              .sort((a, b) => b - a)
              .map((item) => (
                <option key={item}>{item}</option>
              ))}
          </select>
        </label>
        <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter size={14} /> Preview filters
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Filters operate on the labeled sample records shown here.
          </p>
        </div>
      </aside>

      <section>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"
        >
          <Search size={19} className="ml-2 shrink-0 text-slate-400" />
          <input
            aria-label="Search sample research papers"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a topic, title, author, or keyword..."
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className="button-primary !min-h-10 !px-4">
            Search
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {filteredPapers.length} sample{" "}
              {filteredPapers.length === 1 ? "paper" : "papers"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Search and filters run locally in this frontend preview.
            </p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Sample data
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
          {filteredPapers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Search size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No sample papers match those filters
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search or clear the selected filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-blue-800 hover:text-blue-950"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
