"use client";

import type { Category } from "@/types/snippet";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function CategorySelector({
  categories,
  selectedId,
  onChange,
}: CategorySelectorProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">
          {t("category.label")}
        </label>
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold dark:text-white transition-all cursor-pointer text-sm"
        >
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
