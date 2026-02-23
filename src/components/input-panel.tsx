"use client";

import type { SnippetItem } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language-provider";

interface InputPanelProps {
  item: SnippetItem | null;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

export function InputPanel({ item, values, onChange }: InputPanelProps) {
  const { t } = useLanguage();

  if (!item) {
    return (
      <Card>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-slate-400">{t("input.placeholder")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="min-h-[200px]">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">
          {t("input.label")}
        </label>
        <div className="space-y-4">
          {item.inputs.map((input) => (
            <div key={input.id}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                {input.label}
              </label>
              <Input
                type={input.type}
                value={values[input.id] ?? input.default}
                onChange={(e) => onChange(input.id, e.target.value)}
                placeholder={input.default}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
