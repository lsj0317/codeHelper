"use client";

import { X, GripVertical, Trash2 } from "lucide-react";
import type { SnippetItem } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { COMBO_MAX_ITEMS } from "@/lib/combo-utils";

interface ComboBuilderProps {
  items: SnippetItem[];
  onRemove: (itemId: string) => void;
  onReorder: (items: SnippetItem[]) => void;
  onClearAll: () => void;
}

export function ComboBuilder({
  items,
  onRemove,
  onReorder,
  onClearAll,
}: ComboBuilderProps) {
  const { t } = useLanguage();

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onReorder(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onReorder(newItems);
  };

  return (
    <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            {t("combo.builderLabel")}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium">
              {items.length} / {COMBO_MAX_ITEMS}
            </span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 px-2 text-[10px] text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {t("combo.clearAll")}
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">
            {t("combo.emptyHint")}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-700 group"
              >
                {/* Reorder buttons */}
                <div className="flex flex-col shrink-0">
                  <button
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0}
                    className={cn(
                      "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-pointer transition-colors",
                      i === 0 && "opacity-30 cursor-default"
                    )}
                  >
                    <GripVertical className="h-3 w-3 rotate-180" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(i)}
                    disabled={i === items.length - 1}
                    className={cn(
                      "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-pointer transition-colors",
                      i === items.length - 1 && "opacity-30 cursor-default"
                    )}
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                </div>

                {/* Number badge */}
                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>

                {/* Item name */}
                <span className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {item.name}
                </span>

                {/* Remove button */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="shrink-0 p-1 rounded text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
