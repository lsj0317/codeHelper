"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { SnippetItem } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

const PAGE_SIZE = 3;

interface SnippetListProps {
  items: SnippetItem[];
  selectedId: string | null;
  onSelect: (item: SnippetItem) => void;
  page: number;
  onPageChange: (page: number) => void;
  favoriteIds: string[];
  onToggleFavorite?: (itemId: string) => void;
  emptyMessage?: string;
}

export function SnippetList({
  items,
  selectedId,
  onSelect,
  page,
  onPageChange,
  favoriteIds,
  onToggleFavorite,
  emptyMessage,
}: SnippetListProps) {
  const { t } = useLanguage();
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pagedItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Card>
      <CardContent className="min-h-[140px] flex flex-col justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">
            {t("snippetList.label")}
          </label>
          <div className="flex flex-col gap-2">
            {pagedItems.map((item) => {
              const isFav = favoriteIds.includes(item.id);
              const isSelected = selectedId === item.id;

              return (
                <div key={item.id} className="relative flex items-center gap-1">
                  <button
                    onClick={() => onSelect(item)}
                    className={cn(
                      "flex-1 text-left p-3 rounded-xl text-sm font-medium transition-all cursor-pointer pr-10",
                      isSelected
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    {item.name}
                  </button>
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={cn(
                        "absolute right-2 p-1.5 rounded-lg transition-all cursor-pointer",
                        isFav
                          ? "text-yellow-400 hover:text-yellow-500"
                          : isSelected
                            ? "text-blue-200 hover:text-yellow-300"
                            : "text-slate-300 dark:text-slate-600 hover:text-yellow-400"
                      )}
                      title={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        className="h-4 w-4"
                        fill={isFav ? "currentColor" : "none"}
                      />
                    </button>
                  )}
                </div>
              );
            })}
            {pagedItems.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4 whitespace-pre-line">
                {emptyMessage || t("snippetList.empty")}
              </p>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium min-w-[60px] text-center">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
