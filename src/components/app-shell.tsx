"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlignLeft,
  Bookmark,
  ChevronDown,
  Command,
  LayoutDashboard,
  Search,
  Shield,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/search", label: "Discover papers", icon: Search },
  { href: "/saved", label: "Saved papers", icon: Bookmark },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <>
      <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
        <Brand />
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X size={19} />
        </button>
      </div>
      <div className="px-4 pt-6">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
          Workspace
        </p>
        <nav className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href === "/search" && pathname.startsWith("/papers/"));
            return (
              <Link
                href={href}
                key={href}
                onClick={() => setMobileOpen(false)}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
                {label === "Saved papers" && (
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                    Preview
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
          Manage
        </p>
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className={`sidebar-link ${pathname === "/admin" ? "sidebar-link-active" : ""}`}
        >
          <Shield size={17} strokeWidth={1.8} />
          Admin dashboard
        </Link>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <Command size={15} /> Preview workspace
          </div>
          <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
            Catalog preview only. Paper search and bookmarks are not database-backed yet.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50"
        >
          <span className="grid size-9 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
            RA
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-slate-800">
              Preview researcher
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              Demo account · UI only
            </span>
          </span>
          <ChevronDown size={15} className="text-slate-400" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebar}
      </aside>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <AlignLeft size={18} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-medium text-slate-700">
                {pathname === "/dashboard"
                  ? "Overview"
                  : pathname === "/admin"
                    ? "Administration"
                    : pathname === "/saved"
                      ? "Saved papers"
                      : pathname.startsWith("/papers/")
                        ? "Paper details"
                        : "Discover"}
              </span>
            </div>
            <Brand compact />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 sm:inline-flex">
              FRONTEND PREVIEW
            </span>
            <Link
              href="/login"
              className="text-xs font-medium text-slate-500 transition hover:text-blue-800"
            >
              Sign in
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          {children}
        </main>
      </div>
    </div>
  );
}
