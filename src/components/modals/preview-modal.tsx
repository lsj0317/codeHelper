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
import { useLanguage } from "@/components/language-provider";

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
  const { t } = useLanguage();

  const runPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // 프리뷰 환경을 위한 모의(Mock) 스크립트
    const mockScript = `
      <script>
        // 1. URL 파라미터 가상 설정 (URL 파라미터 예제용)
        try {
          // 프리뷰 로드 시 강제로 쿼리 스트링 주입
          window.history.replaceState(null, '', '?id=test_user&key=sample_key&page=1');
        } catch(e) { console.warn('History API not supported'); }

        // 2. jQuery AJAX 모의 구현 (서버 전송 예제용)
        document.addEventListener('DOMContentLoaded', function() {
          if (window.jQuery) {
            window.jQuery.ajax = function(settings) {
              console.log('[Preview] AJAX 요청 감지:', settings);
              
              // 전역 로딩바 테스트를 위해 ajaxStart 트리거
              window.jQuery(document).trigger('ajaxStart');
              
              // 0.5초 뒤 성공 응답 처리 (서버 없이 동작 확인)
              setTimeout(function() {
                if(settings.success) {
                  settings.success({ result: 'ok', msg: '성공 (프리뷰 가상 응답)' });
                }
                
                // 전역 로딩바 테스트를 위해 ajaxStop 트리거
                window.jQuery(document).trigger('ajaxStop');
                
                if(settings.complete) {
                  settings.complete({ status: 200 }, 'success');
                }
              }, 500);
              
              return { abort: function(){} };
            };
          }
        });

        // 3. 클립보드 API 모의 구현 (복사 방지/허용 예제용)
        // Iframe 보안 정책상 실제 클립보드 접근이 막힐 수 있으므로 가상 처리
        if (!navigator.clipboard) {
          navigator.clipboard = {};
        }
        const originalWrite = navigator.clipboard.writeText;
        navigator.clipboard.writeText = function(text) {
          console.log('[Preview] 클립보드 복사 시도:', text);
          alert('클립보드에 복사되었습니다. (프리뷰 모의 실행):\\n' + text);
          return Promise.resolve();
        };

        // 구형 execCommand 대응
        const originalExec = document.execCommand;
        document.execCommand = function(command) {
          if (command === 'copy') {
             alert('클립보드 복사 명령이 실행되었습니다. (프리뷰 모의 실행)');
             return true;
          }
          return originalExec ? originalExec.apply(document, arguments) : false;
        };
      </script>
    `;

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
    /* 스크롤바 스타일링 (선택사항) */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
  </style>
  ${mockScript}
</head>
<body>
  ${htmlCode}
  <script>
    try {
      // 사용자 코드 실행
      ${jsCode}
    } catch(e) {
      document.body.innerHTML += '<div style="color:red;margin-top:20px;padding:10px;border:1px solid red;border-radius:8px;">[실행 오류] ' + e.message + '</div>';
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
            {t("preview.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("preview.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 bg-slate-100 dark:bg-black p-4 relative">
          <div className="absolute inset-4 bg-white rounded-xl shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title={t("preview.iframeTitle")}
              // 클립보드 쓰기 권한 등 보안 정책 완화
              allow="clipboard-write; clipboard-read;"
              sandbox="allow-forms allow-scripts allow-modals allow-same-origin"
            />
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-right rounded-b-2xl">
          <span className="text-xs text-slate-400 mr-2">
            {t("preview.note")}
          </span>
          <Button
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          >
            {t("preview.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
