"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader>
          <DialogTitle>개인정보처리방침</DialogTitle>
          <DialogDescription className="sr-only">
            QueryPick 개인정보처리방침
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 space-y-4">
          <p>
            <strong>1. 수집하는 항목:</strong> 본 사이트는 별도의 회원가입 없이
            이용 가능하며, 개인을 식별할 수 있는 정보를 수집하지 않습니다.
          </p>
          <p>
            <strong>2. 쿠키(Cookie) 사용:</strong> 본 사이트는 구글 애드센스
            광고를 송출하며, 구글은 사용자의 브라우저에 쿠키를 저장하여 방문
            기록을 분석하고 맞춤형 광고를 제공할 수 있습니다.
          </p>
          <p>
            <strong>3. 광고 관련 제어:</strong> 사용자는 브라우저 설정을 통해
            쿠키 저장을 거부할 수 있으며, 구글 광고 설정 페이지에서 맞춤형 광고
            수신 여부를 결정할 수 있습니다.
          </p>
          <p>
            <strong>4. 외부 링크:</strong> 본 사이트에 포함된 광고나 링크는
            제3자의 웹사이트로 연결될 수 있으며, 해당 사이트의
            개인정보처리방침은 본 사이트와 무관합니다.
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 text-right border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
