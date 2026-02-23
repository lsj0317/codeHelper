"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UsageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsageModal({ open, onOpenChange }: UsageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-8">
        <DialogTitle className="text-xl font-bold mb-4 dark:text-white">
          사용법 가이드
        </DialogTitle>
        <DialogDescription className="sr-only">
          QueryPick 사용법 안내
        </DialogDescription>
        <ul className="text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-3 leading-relaxed">
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              1. 검색 및 선택:
            </strong>{" "}
            상단 검색창에서 키워드를 입력하거나, 카테고리와 기능을 직접
            선택하세요.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              2. 정보 입력:
            </strong>{" "}
            선택자(ID/Class)나 함수명 등을 입력하면, 우측의 코드가 실시간으로
            자동 완성됩니다.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              3. 코드 복사:
            </strong>{" "}
            완성된 JS/HTML 코드를 복사하여 프로젝트에 바로 붙여넣으세요.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">
              4. 학습 및 응용:
            </strong>{" "}
            하단의 &lsquo;로직 설명&rsquo;을 통해 원리를 이해하고, &lsquo;AI 프롬프트&rsquo;를
            복사해 챗GPT 등에게 더 심화된 질문을 해보세요.
          </li>
        </ul>
        <Button className="w-full py-6" onClick={() => onOpenChange(false)}>
          이해했습니다
        </Button>
      </DialogContent>
    </Dialog>
  );
}
