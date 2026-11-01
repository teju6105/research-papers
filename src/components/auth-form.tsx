"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setNotice(result.error ?? "Unable to sign in. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setNotice("The account service could not be reached. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-7">
        <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-800">
          <LockKeyhole size={20} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isRegister
            ? "Set up a workspace for your research journey."
            : "Sign in to continue to your research workspace."}
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
        Authentication uses the local MySQL database when configured.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <label className="block text-xs font-semibold text-slate-700">
            Full name
            <input
              required
              name="name"
              autoComplete="name"
              className="input-field mt-2"
              placeholder="Your name"
            />
          </label>
        )}
        <label className="block text-xs font-semibold text-slate-700">
          Email address
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="input-field mt-2"
            placeholder="you@university.edu"
          />
        </label>
        <label className="block text-xs font-semibold text-slate-700">
          Password
          <input
            required
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={8}
            className="input-field mt-2"
            placeholder={isRegister ? "At least 8 characters" : "Your password"}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary w-full !min-h-11 disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}{" "}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </form>

      {notice && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-slate-100 px-3 py-2.5 text-xs leading-5 text-slate-700"
        >
          {notice}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {isRegister ? "Already have an account?" : "New to Research Atlas?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-blue-800 hover:text-blue-950"
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
