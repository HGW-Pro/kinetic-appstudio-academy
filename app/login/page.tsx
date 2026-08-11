"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the browser to Google, so no further action here.
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

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] shadow-sm transition hover:bg-[var(--surface-2)] disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.85 2.07-1.81 2.71v2.26h2.92c1.7-1.57 2.69-3.88 2.69-6.61z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A8.99 8.99 0 000 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs uppercase tracking-wide text-[var(--text-lo)]">or</span>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
