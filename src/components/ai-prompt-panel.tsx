"use client";

import { Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useLanguage } from "@/components/language-provider";

interface AiPromptPanelProps {
  prompt: string;
}

export function AiPromptPanel({ prompt }: AiPromptPanelProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      showToast(t("aiPrompt.copied"));
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast(t("aiPrompt.copied"));
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("aiPrompt.title")}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="text-[10px] h-7"
          >
            <Copy className="h-3 w-3 mr-1" />
            {t("aiPrompt.copy")}
          </Button>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed break-all">
            {prompt}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
          {t("aiPrompt.hint")}
        </p>
      </CardContent>
    </Card>
  );
}
