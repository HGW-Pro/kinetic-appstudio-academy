"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  label = "Delete",
  confirmText,
  action,
  redirectTo,
  className,
}: {
  label?: string;
  confirmText: string;
  action: () => Promise<{ error: string | null }>;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // revalidatePath() on the server already invalidated the cache for
        // this route; router.refresh() re-fetches the Server Component tree
        // against that fresh cache -- an instant in-place update with no
        // hard page reload.
        router.refresh();
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={
          className ??
          "rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        }
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && <span className="max-w-[10rem] text-xs text-red-600">⚠️ {error}</span>}
    </span>
  );
}
