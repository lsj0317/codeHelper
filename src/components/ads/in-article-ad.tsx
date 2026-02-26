"use client";

import { AdSenseUnit } from "./adsense-unit";

interface InArticleAdProps {
  slot: string;
}

/**
 * In-article ad placed between content sections
 * Appears naturally between JS code and HTML code displays
 */
export function InArticleAd({ slot }: InArticleAdProps) {
  return (
    <div className="w-full flex justify-center py-2">
      <AdSenseUnit
        slot={slot}
        format="auto"
        layout="in-article"
        responsive={true}
        style={{ display: "block", textAlign: "center" }}
        className="w-full max-w-full overflow-hidden"
      />
    </div>
  );
}
