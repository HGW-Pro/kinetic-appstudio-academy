"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const result =
      mode === "signup" ? await signUp(email, password, fullName) : await signIn(email, password);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (mode === "signup") {
      setInfo("Account created. Check your inbox to confirm your email, then sign in.");
      setMode("signin");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="glass-card glow-border rounded-2xl p-8">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white">
            K
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)]">
            {mode === "signin" ? "Sign in to your Academy" : "Create your Academy account"}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Track your lessons, quiz scores, and certifications across every device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-mid)]">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none focus:border-[var(--primary)]"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-mid)]">Work email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none focus:border-[var(--primary)]"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-mid)]">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none focus:border-[var(--primary)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-3 py-2 text-sm text-[var(--error)]">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-md border border-[var(--success)]/30 bg-[var(--success-soft)] px-3 py-2 text-sm text-[var(--success)]">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-mid)]">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--text-lo)]">
        <Link href="/" className="hover:underline">← Back to home</Link>
      </p>
    </div>
  );
}
