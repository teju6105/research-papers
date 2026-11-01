import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { SamplePaper } from "@/lib/sample-papers";
import { SaveButton } from "@/components/save-button";

export function PaperCard({ paper }: { paper: SamplePaper }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,35,75,0.04)] transition hover:border-blue-200 hover:shadow-[0_8px_24px_-16px_rgba(15,35,75,0.25)] sm:p-6">
      <div className="flex items-start gap-4">
        <Link
          href={`/papers/${paper.id}`}
          className="min-w-0 flex-1 group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
              {paper.topic}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              Sample preview
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6 text-slate-900 transition group-hover:text-blue-800 sm:text-lg">
            {paper.title}
          </h3>
        </Link>
        <SaveButton paperId={paper.id} />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {paper.authors.join(", ")} <span className="px-1 text-slate-300">·</span>{" "}
        {paper.year}
      </p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {paper.abstract}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {paper.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-500"
            >
              {keyword}
            </span>
          ))}
        </div>
        <Link
          href={`/papers/${paper.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
        >
          View paper <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock3 size={13} /> {paper.readingTime}{" "}
        <span className="px-1">·</span> {paper.journal}
      </div>
    </article>
  );
}
