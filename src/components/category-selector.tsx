"use client";

import { Star, Clock } from "lucide-react";
import type { Category } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

export const FAVORITES_CATEGORY_ID = "__favorites__";
export const RECENT_CATEGORY_ID = "__recent__";

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string;
  onChange: (id: string) => void;
  favoritesCount: number;
  recentCount: number;
}

export function CategorySelector({
  categories,
  selectedId,
  onChange,
  favoritesCount,
  recentCount,
}: CategorySelectorProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">
          {t("category.label")}
        </label>

        {/* 즐겨찾기 / 최근 사용 바로가기 버튼 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onChange(FAVORITES_CATEGORY_ID)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
              selectedId === FAVORITES_CATEGORY_ID
                ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-yellow-300 dark:hover:border-yellow-700"
            )}
          >
            <Star className="h-3.5 w-3.5" fill={selectedId === FAVORITES_CATEGORY_ID ? "currentColor" : "none"} />
            {t("category.favorites")}
            {favoritesCount > 0 && (
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onChange(RECENT_CATEGORY_ID)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
              selectedId === RECENT_CATEGORY_ID
                ? "bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-700"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {t("category.recent")}
            {recentCount > 0 && (
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {recentCount}
              </span>
            )}
          </button>
        </div>

        {/* 기존 카테고리 드롭다운 */}
        <select
          value={selectedId === FAVORITES_CATEGORY_ID || selectedId === RECENT_CATEGORY_ID ? "" : selectedId}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold dark:text-white transition-all cursor-pointer text-sm",
            (selectedId === FAVORITES_CATEGORY_ID || selectedId === RECENT_CATEGORY_ID) && "text-slate-400"
          )}
        >
          {(selectedId === FAVORITES_CATEGORY_ID || selectedId === RECENT_CATEGORY_ID) && (
            <option value="" disabled>
              — {t("category.label")} —
            </option>
          )}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}
