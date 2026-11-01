import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CircleAlert,
  Database,
  FilePlus2,
  Pencil,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { samplePapers } from "@/lib/sample-papers";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <Shield size={14} /> Catalog management
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Preview of the future research catalog management workspace.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Catalog management will be connected in a later stage"
          className="button-primary cursor-not-allowed self-start opacity-55 sm:self-auto"
        >
          <FilePlus2 size={16} /> Add paper
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
        <CircleAlert size={17} className="mt-0.5 shrink-0 text-amber-700" />
        <div>
          <p className="text-xs font-semibold text-amber-900">
            Preview only — admin actions are disabled
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            The rows below are fictional sample records. Create, edit, delete,
            user management, and database operations are not connected.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Sample catalog entries",
            value: samplePapers.length.toString(),
            icon: BookOpen,
            detail: "Frontend preview records",
          },
          {
            label: "User accounts",
            value: "Not connected",
            icon: Users,
            detail: "No user database access",
          },
          {
            label: "Catalog database",
            value: "Preview only",
            icon: Database,
            detail: "Paper catalog not connected",
          },
        ].map(({ label, value, icon: Icon, detail }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <Icon size={18} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Sample paper catalog
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Preview rows · no changes can be saved
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
          >
            Open search <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-5 py-3">
                  Paper
                </th>
                <th scope="col" className="px-4 py-3">
                  Topic
                </th>
                <th scope="col" className="px-4 py-3">
                  Year
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Preview actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samplePapers.map((paper) => (
                <tr key={paper.id} className="align-middle">
                  <td className="px-5 py-4">
                    <Link
                      href={`/papers/${paper.id}`}
                      className="block max-w-[330px] text-xs font-semibold leading-5 text-slate-800 hover:text-blue-800"
                    >
                      {paper.title}
                    </Link>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      {paper.authors.join(", ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    {paper.topic}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    {paper.year}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-800">
                      Sample
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        disabled
                        aria-label="Edit disabled in preview"
                        title="Editing is not connected"
                        className="grid size-8 cursor-not-allowed place-items-center rounded-lg text-slate-300"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        disabled
                        aria-label="Delete disabled in preview"
                        title="Deletion is not connected"
                        className="grid size-8 cursor-not-allowed place-items-center rounded-lg text-slate-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
