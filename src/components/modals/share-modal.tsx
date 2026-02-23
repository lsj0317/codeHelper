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

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareModal({ open, onOpenChange, shareUrl }: ShareModalProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("공유 링크가 복사되었습니다!");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("공유 링크가 복사되었습니다!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader>
          <DialogTitle>링크 공유하기</DialogTitle>
          <DialogDescription className="sr-only">
            현재 스니펫 설정을 공유할 수 있는 링크입니다
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              공유 링크
            </label>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} className="flex-1" />
              <Button onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                복사
              </Button>
            </div>
          </div>
          <Button
            variant="kakao"
            className="w-full"
            onClick={() => {
              showToast("카카오톡 공유 기능은 준비 중입니다.");
            }}
          >
            💬 카카오톡으로 공유하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
