"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center relative overflow-hidden w-9 h-9"
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-300 absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-100" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
      <div className={`transition-transform duration-300 absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    </button>
  );
}
