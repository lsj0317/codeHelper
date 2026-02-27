"use client";

import { useState } from "react";
import { BookOpen, AlignLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { TutorialPanel } from "@/components/tutorial-panel";

interface DescriptionPanelProps {
  description: string;
  code?: string;
}

export function DescriptionPanel({ description, code }: DescriptionPanelProps) {
  const { t } = useLanguage();
  const [tutorialMode, setTutorialMode] = useState(false);
  const lines = description.split("\n").filter(Boolean);

  // Tutorial mode available only when we have both code and multi-line description
  const canTutorial = !!code && lines.length >= 2;

  if (tutorialMode && canTutorial && code) {
    return (
      <div className="space-y-2">
        {/* Mode toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setTutorialMode(false)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
              "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <AlignLeft className="h-3 w-3" />
            {t("tutorial.textMode")}
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
              "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
            )}
          >
            <BookOpen className="h-3 w-3" />
            {t("tutorial.tutorialMode")}
          </button>
        </div>
        <TutorialPanel code={code} description={description} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Mode toggle (only if tutorial is available) */}
      {canTutorial && (
        <div className="flex gap-1">
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
              "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
            )}
          >
            <AlignLeft className="h-3 w-3" />
            {t("tutorial.textMode")}
          </button>
          <button
            onClick={() => setTutorialMode(true)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
              "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <BookOpen className="h-3 w-3" />
            {t("tutorial.tutorialMode")}
          </button>
        </div>
      )}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t("description.title")}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
            {lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
