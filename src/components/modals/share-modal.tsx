"use client";

import { Copy } from "lucide-react";
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

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareModal({ open, onOpenChange, shareUrl }: ShareModalProps) {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(t("share.copied"));
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast(t("share.copied"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader>
          <DialogTitle>{t("share.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("share.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              {t("share.label")}
            </label>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} className="flex-1" />
              <Button onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                {t("share.copy")}
              </Button>
            </div>
          </div>
          <Button
            variant="kakao"
            className="w-full"
            onClick={() => {
              showToast(t("share.kakaoPending"));
            }}
          >
            {t("share.kakao")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
