"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

interface UsageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageModal({ open, onOpenChange }: UsageModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-8">
        <DialogTitle className="text-xl font-bold mb-4 dark:text-white">
          {t("usage.title")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("usage.description")}
        </DialogDescription>
        <ul className="text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-3 leading-relaxed">
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              {t("usage.step1.title")}
            </strong>{" "}
            {t("usage.step1.text")}
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              {t("usage.step2.title")}
            </strong>{" "}
            {t("usage.step2.text")}
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              {t("usage.step3.title")}
            </strong>{" "}
            {t("usage.step3.text")}
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              {t("usage.step4.title")}
            </strong>{" "}
            {t("usage.step4.text")}
          </li>
        </ul>
        <Button className="w-full py-6" onClick={() => onOpenChange(false)}>
          {t("usage.confirm")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
