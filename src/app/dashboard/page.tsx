import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Compass,
  LibraryBig,
  Search,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PaperCard } from "@/components/paper-card";
import { samplePapers } from "@/lib/sample-papers";

const shortcuts = [
  {
    href: "/search",
    icon: Search,
    title: "Search the catalog",
    description: "Explore titles, topics, authors, and keywords.",
  },
  {
    href: "/saved",
    icon: Bookmark,
    title: "Build a reading list",
    description: "Bookmark papers to revisit in this browser preview.",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> Your research workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, Researcher
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A calm place to explore your next big question.
          </p>
        </div>
        <Link href="/search" className="button-primary self-start sm:self-auto">
          <Search size={16} /> Explore papers
        </Link>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Preview papers",
            value: samplePapers.length.toString(),
            detail: "Clearly labeled examples",
            icon: LibraryBig,
          },
          {
            label: "Research topics",
            value: new Set(samplePapers.map((paper) => paper.topic)).size.toString(),
            detail: "Across sample disciplines",
            icon: Compass,
          },
          {
            label: "Your saved list",
            value: "In this browser",
            detail: "Preview-only bookmarks",
            icon: Bookmark,
          },
        ].map(({ label, value, detail, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-800">
                <Icon size={18} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.8fr)]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Start exploring
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Sample catalog picks to preview the reading experience.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {samplePapers.slice(0, 2).map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#142b54] p-5 text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10">
              <Sparkles size={19} />
            </span>
            <h2 className="mt-4 text-base font-semibold">
              Find a new perspective
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-100/80">
              Search for a question, topic, or author to explore the sample
              catalog.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-blue-100"
            >
              Open paper search <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Quick links
            </h2>
            <div className="mt-3 space-y-1">
              {shortcuts.map(({ href, icon: Icon, title, description }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-800">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-slate-800">
                      {title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                      {description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        Frontend preview: all displayed papers are fictional sample records.
        No account, catalog, or recommendation database is connected.
      </p>
    </AppShell>
  );
}
