"use client";

import Image from "next/image";
import { Moon, Sun, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenUsageGuide: () => void;
}

export function Header({ onOpenUsageGuide }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-2">
        <Image
          src="/images/genJqueryIcon.png"
          alt="QueryPick Logo"
          width={32}
          height={32}
          className="rounded-lg object-cover"
        />
        <h1 className="text-xl font-black tracking-tight dark:text-white">
          QueryPick
        </h1>
      </div>

      <nav className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenUsageGuide}
          className="text-slate-500 dark:text-slate-400 hover:text-blue-600"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">사용법</span>
        </Button>
      </nav>
    </header>
  );
}
