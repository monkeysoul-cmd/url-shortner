import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("linkcut_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("linkcut_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("linkcut_theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] bg-black/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-black/[0.08] dark:hover:bg-white/[0.08] transition-all shadow-sm cursor-pointer border border-black/[0.06] dark:border-white/[0.06] overflow-hidden group"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
      id="theme-toggle"
    >
      <div className="transition-transform duration-500 ease-spring group-hover:scale-110" style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}>
        {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />}
      </div>
    </button>
  );
};
