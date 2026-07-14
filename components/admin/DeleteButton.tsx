"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Generic delete control. Receives a bound server action as a prop
 * (bound on the server with the right ids), so it stays type-safe and secure.
 */
export default function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this? This cannot be undone.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-200 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}
