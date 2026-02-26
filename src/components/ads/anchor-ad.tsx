"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdSenseUnit } from "./adsense-unit";

interface AnchorAdProps {
  slot: string;
}

/**
 * Mobile-only sticky bottom anchor ad
 * Shows on screens where sidebars are hidden (< lg)
 * User can dismiss it with the X button
 */
export function AnchorAd({ slot }: AnchorAdProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-8 right-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors z-10"
          aria-label="광고 닫기"
        >
          <X className="h-3 w-3" />
        </button>
        <AdSenseUnit
          slot={slot}
          format="horizontal"
          responsive={true}
          style={{ display: "block", width: "100%", height: "50px" }}
          className="w-full"
        />
      </div>
    </div>
  );
}
