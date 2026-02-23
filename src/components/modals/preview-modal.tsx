"use client";

import { useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsCode: string;
  htmlCode: string;
}

export function PreviewModal({
  open,
  onOpenChange,
  jsCode,
  htmlCode,
}: PreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"><\/script>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    try {
      ${jsCode}
    } catch(e) {
      document.body.innerHTML += '<div style="color:red;margin-top:20px;padding:10px;border:1px solid red;border-radius:8px;">' + e.message + '</div>';
    }
  <\/script>
</body>
</html>`;

    doc.open();
    doc.write(fullHtml);
    doc.close();
  }, [jsCode, htmlCode]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTimeout(runPreview, 100);
    } else {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = "about:blank";
      }
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            기능 미리보기 (Preview)
          </DialogTitle>
          <DialogDescription className="sr-only">
            코드 실행 미리보기 화면입니다
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 bg-slate-100 dark:bg-black p-4 relative">
          <div className="absolute inset-4 bg-white rounded-xl shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="코드 미리보기"
            />
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-right rounded-b-2xl">
          <span className="text-xs text-slate-400 mr-2">
            * 실제 동작 환경과 동일하게 시뮬레이션 됩니다.
          </span>
          <Button
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
