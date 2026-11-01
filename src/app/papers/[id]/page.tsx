import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  LibraryBig,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PaperCard } from "@/components/paper-card";
import { SaveButton } from "@/components/save-button";
import { samplePapers } from "@/lib/sample-papers";

type PaperPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return samplePapers.map((paper) => ({ id: paper.id }));
}

export async function generateMetadata({
  params,
}: PaperPageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = samplePapers.find((item) => item.id === id);
  return { title: paper?.title ?? "Paper details" };
}

export default async function PaperDetailsPage({ params }: PaperPageProps) {
  const { id } = await params;
  const paper = samplePapers.find((item) => item.id === id);
  if (!paper) notFound();

  const relatedPapers = samplePapers
    .filter((item) => item.id !== paper.id && item.topic === paper.topic)
    .concat(
      samplePapers.filter(
        (item) => item.id !== paper.id && item.topic !== paper.topic,
      ),
    )
    .slice(0, 2);

  return (
    <AppShell>
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-blue-800"
      >
        <ArrowLeft size={15} /> Back to search
      </Link>
      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
              {paper.topic}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              Fictional sample record
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
            {paper.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {paper.authors.join(", ")}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-b border-slate-100 pb-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} /> {paper.year}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LibraryBig size={14} /> {paper.journal}
            </span>
          </div>
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText size={16} className="text-blue-800" /> Abstract
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {paper.abstract}
            </p>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
              This abstract is fictional sample text created for the interface
              preview. It is not a published research paper.
            </p>
          </section>
          <section className="mt-7">
            <h2 className="text-sm font-semibold text-slate-900">Keywords</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {paper.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Reading list
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Save this sample paper in your browser preview.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SaveButton paperId={paper.id} />
              <span className="text-xs font-medium text-slate-600">
                Save paper
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <BookOpen size={16} className="text-blue-800" />
              Related sample papers
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Preview links only—not AI recommendations.
            </p>
            <div className="mt-3 divide-y divide-slate-100">
              {relatedPapers.map((related) => (
                <Link
                  href={`/papers/${related.id}`}
                  key={related.id}
                  className="block py-3 first:pt-1 last:pb-0"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                    {related.topic}
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-800 hover:text-blue-800">
                    {related.title}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400">
                    Open sample <ArrowUpRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {relatedPapers.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                More to explore
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Additional fictional sample records.
              </p>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {relatedPapers.map((related) => (
              <PaperCard key={related.id} paper={related} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
