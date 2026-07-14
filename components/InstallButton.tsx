"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Floating "Install app" button, shown when the browser allows installation. */
export default function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setHidden(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred || hidden) return null;

  return (
    <button
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice.catch(() => {});
        setDeferred(null);
      }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-soft-pink-deep px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-soft-pink/40 transition-transform hover:scale-105"
    >
      <span aria-hidden>📲</span> Install app
    </button>
  );
}
