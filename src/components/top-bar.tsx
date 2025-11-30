"use client";

import { ThemeToggle } from "~/components/theme-toggle";
import { useLanguage } from "~/lib/language-context";
import { cn } from "~/lib/utils";

const languages: Array<"en" | "ta"> = ["en", "ta"];

export function TopBar() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-4 backdrop-blur">
      <span className="text-lg font-semibold tracking-wide">Pitch Perfect</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-secondary px-1 py-1 text-xs">
          {languages.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              aria-pressed={language === code ? "true" : "false"}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors",
                language === code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
