"use client";

interface FooterProps {
  onOpenPrivacy: () => void;
}

export function Footer({ onOpenPrivacy }: FooterProps) {
  return (
    <footer className="h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-6 text-[10px] text-slate-400 transition-colors">
      <span>&copy; 2026 QueryPick</span>
      <button
        onClick={onOpenPrivacy}
        className="hover:text-blue-500 transition cursor-pointer"
      >
        개인정보처리방침
      </button>
    </footer>
  );
}
