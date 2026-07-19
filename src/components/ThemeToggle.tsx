import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  // Always dark mode in the new design, but keep toggle functional
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("linkcut_theme", "dark");
  }, []);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-white/[0.04] text-zinc-400 hover:text-violet-400 hover:bg-white/[0.08] transition-all shadow-sm cursor-pointer border border-white/[0.06] overflow-hidden"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
      id="theme-toggle"
    >
      <div className="transition-transform duration-300" style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}>
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </div>
    </button>
  );
};
