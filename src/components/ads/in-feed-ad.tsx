"use client";

import { AdSenseUnit } from "./adsense-unit";

interface InFeedAdProps {
  slot: string;
  layoutKey: string;
}

/**
 * In-feed ad that blends into snippet list items
 * Placed between snippet cards for natural ad exposure
 */
export function InFeedAd({ slot, layoutKey }: InFeedAdProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <AdSenseUnit
        slot={slot}
        format="auto"
        layout="in-feed"
        layoutKey={layoutKey}
        responsive={true}
        style={{ display: "block" }}
        className="w-full"
      />
    </div>
  );
}
