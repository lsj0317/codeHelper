"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle>{t("privacy.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("privacy.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 space-y-4">
          <p>
            <strong>{t("privacy.item1.title")}</strong> {t("privacy.item1.text")}
          </p>
          <p>
            <strong>{t("privacy.item2.title")}</strong> {t("privacy.item2.text")}
          </p>
          <p>
            <strong>{t("privacy.item3.title")}</strong> {t("privacy.item3.text")}
          </p>
          <p>
            <strong>{t("privacy.item4.title")}</strong> {t("privacy.item4.text")}
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 text-right border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("privacy.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
