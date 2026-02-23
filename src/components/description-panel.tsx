"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

interface DescriptionPanelProps {
  description: string;
}

export function DescriptionPanel({ description }: DescriptionPanelProps) {
  const { t } = useLanguage();
  const lines = description.split("\n").filter(Boolean);

  return (
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
  );
}
