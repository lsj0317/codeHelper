"use client";

import { useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useLanguage } from "@/components/language-provider";

interface CodeDisplayProps {
  code: string;
  language: "javascript" | "markup";
  label: string;
  colorClass: string;
  dotColor: string;
}

export function CodeDisplay({
  code,
  language,
  label,
  colorClass,
  dotColor,
}: CodeDisplayProps) {
  const codeRef = useRef<HTMLElement>(null);
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.textContent = code;
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showToast(t("code.copied"));
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast(t("code.copied"));
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row justify-between items-center">
        <span className={`${colorClass} text-xs font-bold flex items-center gap-2`}>
          <span className={`w-2 h-2 ${dotColor} rounded-full`} />
          {label}
        </span>
        <Button
          variant={language === "javascript" ? "default" : "emerald"}
          size="sm"
          onClick={handleCopy}
          className="text-[10px] h-7"
        >
          <Copy className="h-3 w-3 mr-1" />
          {t("code.copy")}
        </Button>
      </CardHeader>
      <pre className={`p-6 overflow-x-auto language-${language} bg-transparent`}>
        <code
          ref={codeRef}
          className={`language-${language} dark:text-blue-300 text-sm leading-relaxed`}
        />
      </pre>
    </Card>
  );
}
