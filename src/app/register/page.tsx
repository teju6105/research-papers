import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
      <section className="relative hidden overflow-hidden bg-[#142b54] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-36 top-24 size-[470px] rounded-full border border-white/10" />
        <div className="absolute -right-16 top-44 size-[320px] rounded-full border border-white/10" />
        <Brand />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-blue-200">
            Start with a question
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Your research
            <span className="block text-blue-200">starts somewhere.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/75">
            Build a reading list, follow your curiosity, and find a clearer path
            through academic ideas.
          </p>
        </div>
        <p className="relative z-10 text-xs text-blue-200/70">
          Research Atlas · Frontend preview
        </p>
      </section>
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Brand />
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-800"
          >
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <AuthForm mode="register" />
        </div>
        <p className="text-center text-[11px] text-slate-400">
          Passwords are hashed before they are stored.
        </p>
      </section>
    </main>
  );
}
