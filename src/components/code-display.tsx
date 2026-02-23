"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Copy, Pencil, Eye, RotateCcw } from "lucide-react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
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
  onCodeChange?: (code: string) => void;
}

const LANG_MAP: Record<string, string> = {
  javascript: "javascript",
  markup: "html",
};

export function CodeDisplay({
  code,
  language,
  label,
  colorClass,
  dotColor,
  onCodeChange,
}: CodeDisplayProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState<string | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Reset edited code when template code changes (input value changes)
  useEffect(() => {
    setEditedCode(null);
  }, [code]);

  const displayCode = editedCode ?? code;
  const isModified = editedCode !== null;

  const lineCount = displayCode.split("\n").length;
  const editorHeight = Math.max(120, Math.min(lineCount * 20 + 20, 500));

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newVal = value ?? "";
      setEditedCode(newVal);
      onCodeChange?.(newVal);
    },
    [onCodeChange]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      showToast(t("code.copied"));
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = displayCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast(t("code.copied"));
    }
  };

  const handleReset = () => {
    setEditedCode(null);
    onCodeChange?.(code);
    showToast(t("code.reset"));
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const monacoLang = LANG_MAP[language] ?? "plaintext";
  const isDark = resolvedTheme === "dark";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row justify-between items-center">
        <span
          className={`${colorClass} text-xs font-bold flex items-center gap-2`}
        >
          <span className={`w-2 h-2 ${dotColor} rounded-full`} />
          {label}
          {isModified && (
            <span className="text-[10px] font-normal text-amber-500 dark:text-amber-400 ml-1">
              ({t("code.modified")})
            </span>
          )}
        </span>
        <div className="flex items-center gap-1">
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[10px] h-7 text-amber-600 dark:text-amber-400 hover:text-amber-700"
              title={t("code.resetTooltip")}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {t("code.reset")}
            </Button>
          )}
          <Button
            variant={editMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleEditMode}
            className="text-[10px] h-7"
            title={
              editMode ? t("code.viewMode") : t("code.editMode")
            }
          >
            {editMode ? (
              <Eye className="h-3 w-3 mr-1" />
            ) : (
              <Pencil className="h-3 w-3 mr-1" />
            )}
            {editMode ? t("code.viewMode") : t("code.editMode")}
          </Button>
          <Button
            variant={language === "javascript" ? "default" : "emerald"}
            size="sm"
            onClick={handleCopy}
            className="text-[10px] h-7"
          >
            <Copy className="h-3 w-3 mr-1" />
            {t("code.copy")}
          </Button>
        </div>
      </CardHeader>
      <div className="relative" style={{ height: editorHeight }}>
        <Editor
          height="100%"
          language={monacoLang}
          value={displayCode}
          theme={isDark ? "vs-dark" : "light"}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            readOnly: !editMode,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: editMode ? "on" : "off",
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: editMode ? 3 : 0,
            renderLineHighlight: editMode ? "line" : "none",
            fontSize: 13,
            fontFamily: "'Fira Code', 'Cascadia Code', Menlo, Monaco, 'Courier New', monospace",
            padding: { top: 12, bottom: 12 },
            wordWrap: "on",
            contextmenu: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            domReadOnly: !editMode,
            cursorStyle: editMode ? "line" : "line-thin",
          }}
        />
      </div>
    </Card>
  );
}
