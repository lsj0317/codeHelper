"use client";

import type { SnippetItem } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language-provider";

interface InputPanelProps {
  item: SnippetItem | null;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  // Combo mode props
  comboItems?: SnippetItem[];
  comboValues?: Record<string, Record<string, string>>;
  onComboChange?: (itemId: string, inputId: string, value: string) => void;
}

export function InputPanel({
  item,
  values,
  onChange,
  comboItems,
  comboValues,
  onComboChange,
}: InputPanelProps) {
  const { t } = useLanguage();

  // ── Combo mode ──
  if (comboItems && comboItems.length > 0 && comboValues && onComboChange) {
    return (
      <Card>
        <CardContent className="min-h-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">
            {t("input.label")}
          </label>
          <div className="space-y-5">
            {comboItems.map((comboItem, i) => {
              const itemVals = comboValues[comboItem.id] ?? {};
              if (comboItem.inputs.length === 0) return null;

              return (
                <div key={comboItem.id}>
                  {/* Snippet name header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {comboItem.name}
                    </span>
                  </div>
                  {/* Inputs for this snippet */}
                  <div className="space-y-3 pl-7">
                    {comboItem.inputs.map((input) => (
                      <div key={`${comboItem.id}_${input.id}`}>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          {input.label}
                        </label>
                        <Input
                          type={input.type}
                          value={itemVals[input.id] ?? input.default}
                          onChange={(e) =>
                            onComboChange(comboItem.id, input.id, e.target.value)
                          }
                          placeholder={input.default}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Single mode ──
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
