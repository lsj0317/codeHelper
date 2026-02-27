"use client";

import { useState } from "react";
import { Download, ExternalLink, Github, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useLanguage } from "@/components/language-provider";
import {
  downloadJs,
  downloadHtml,
  openInCodePen,
  openInJSFiddle,
  createGist,
  getGistToken,
  saveGistToken,
} from "@/lib/export-utils";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsCode: string;
  htmlCode: string;
  title?: string;
}

export function ExportModal({
  open,
  onOpenChange,
  jsCode,
  htmlCode,
  title = "QueryPick Snippet",
}: ExportModalProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [gistToken, setGistToken] = useState(() => getGistToken());
  const [showToken, setShowToken] = useState(false);
  const [gistLoading, setGistLoading] = useState(false);

  const handleDownloadJs = () => {
    downloadJs(jsCode);
    showToast(t("export.downloadStarted"));
  };

  const handleDownloadHtml = () => {
    downloadHtml(jsCode, htmlCode);
    showToast(t("export.downloadStarted"));
  };

  const handleCodePen = () => {
    openInCodePen(jsCode, htmlCode, title);
  };

  const handleJSFiddle = () => {
    openInJSFiddle(jsCode, htmlCode, title);
  };

  const handleCreateGist = async () => {
    if (!gistToken.trim()) {
      showToast(t("export.gistTokenRequired"));
      return;
    }

    setGistLoading(true);
    try {
      saveGistToken(gistToken);
      const url = await createGist(jsCode, htmlCode, gistToken, title);
      window.open(url, "_blank");
      showToast(t("export.gistCreated"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      showToast(`${t("export.gistFailed")}: ${msg}`);
    } finally {
      setGistLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader>
          <DialogTitle>{t("export.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("export.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-5">
          {/* Section 1: File Download */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              {t("export.downloadLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleDownloadJs} className="justify-start">
                <Download className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">.js {t("export.file")}</span>
              </Button>
              <Button variant="outline" onClick={handleDownloadHtml} className="justify-start">
                <Download className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">.html {t("export.file")}</span>
              </Button>
            </div>
          </div>

          {/* Section 2: Online Editors */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              {t("export.onlineLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleCodePen} className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2 shrink-0" />
                CodePen
              </Button>
              <Button variant="outline" onClick={handleJSFiddle} className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2 shrink-0" />
                JSFiddle
              </Button>
            </div>
          </div>

          {/* Section 3: GitHub Gist */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              GitHub Gist
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showToken ? "text" : "password"}
                  value={gistToken}
                  onChange={(e) => setGistToken(e.target.value)}
                  placeholder={t("export.gistTokenPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {t("export.gistHint")}
              </p>
              <Button
                onClick={handleCreateGist}
                disabled={gistLoading || !gistToken.trim()}
                className="w-full"
              >
                <Github className="h-4 w-4 mr-2" />
                {gistLoading ? t("export.gistLoading") : t("export.gistCreate")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
