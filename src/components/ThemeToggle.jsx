import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      aria-pressed={dark}
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm
                 bg-white/90 dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <span aria-hidden="true">{dark ? "🌙" : "☀️"}</span>
      <span>{dark ? "Dark" : "Light"} mode</span>
    </button>
  );
}
