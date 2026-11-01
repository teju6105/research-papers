import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BrainCircuit,
  Check,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/brand";

const benefits = [
  {
    icon: Search,
    title: "Search beyond keywords",
    description:
      "Explore publications by topic, author, and the ideas behind your question.",
  },
  {
    icon: BrainCircuit,
    title: "Discover meaningful connections",
    description:
      "Find related work across disciplines with a research-focused workflow.",
  },
  {
    icon: Bookmark,
    title: "Keep your reading organized",
    description:
      "Save papers as you explore and build a shortlist for your next project.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="transition hover:text-blue-900">
            How it works
          </a>
          <a href="#features" className="transition hover:text-blue-900">
            Features
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/register" className="button-primary">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="hero-grid relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="relative z-10 max-w-2xl">
          <div className="eyebrow mb-6">
            <Sparkles size={14} /> A clearer path through research
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">
            Find the research
            <span className="block text-blue-800">that moves you forward.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Search across academic ideas, discover work connected to your
            interests, and keep the papers worth coming back to.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/search" className="button-primary button-large">
              Explore research <ArrowRight size={17} />
            </Link>
            <Link href="/register" className="button-secondary button-large">
              Create a free account
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            {["Built for curious minds", "Search by meaning", "Save as you go"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check size={15} className="text-emerald-600" /> {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[530px]">
          <div className="absolute -inset-8 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_90px_-40px_rgba(15,35,75,0.35)] sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-700">
                  Your research workspace
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  What are you exploring?
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-800">
                <BrainCircuit size={20} />
              </span>
            </div>
            <Link
              href="/search"
              className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-400 transition hover:border-blue-300 hover:bg-white"
            >
              <Search size={18} />
              Search a topic, question, or author...
              <span className="ml-auto hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500 sm:inline">
                Explore
              </span>
            </Link>
            <div className="mt-5 flex flex-wrap gap-2">
              {["machine learning", "climate science", "public health"].map(
                (topic) => (
                  <Link
                    href="/search"
                    key={topic}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    {topic}
                  </Link>
                ),
              )}
            </div>
            <div className="my-6 h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                Your next great read is out there
              </p>
              <span className="text-xs text-slate-400">Start exploring</span>
            </div>
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-sm">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Search with your own words
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Describe the question you are researching to get started.
                  </p>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-blue-700" />
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-400">
              Product preview · sample papers are clearly identified
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-slate-100 bg-slate-50/70 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="eyebrow">Research, with less friction</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              From a question to a reading list.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-800">
                  <Icon size={20} />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center lg:px-12"
      >
        <div>
          <p className="eyebrow">
            <ShieldCheck size={14} /> A thoughtful research companion
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Your next idea starts with a search.
          </h2>
        </div>
        <Link href="/register" className="button-primary">
          Start exploring <ArrowRight size={16} />
        </Link>
      </section>
      <footer className="border-t border-slate-100 px-5 py-6 text-center text-xs text-slate-400">
        Research Atlas · Academic discovery workspace · Frontend preview
      </footer>
    </main>
  );
}
