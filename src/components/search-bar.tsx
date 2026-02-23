"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">
          {t("search.label")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-sm"
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
        </div>
      </CardContent>
    </Card>
  );
}
