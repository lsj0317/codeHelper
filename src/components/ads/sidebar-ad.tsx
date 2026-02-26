"use client";

import { AdSenseUnit } from "./adsense-unit";

interface SidebarAdProps {
  slot: string;
}

/**
 * Sidebar display ad (160x600 Skyscraper)
 * Used for left/right sidebar ad areas
 */
export function SidebarAd({ slot }: SidebarAdProps) {
  return (
    <div className="w-full sticky top-4">
      <AdSenseUnit
        slot={slot}
        format="vertical"
        style={{ display: "inline-block", width: "160px", height: "600px" }}
        responsive={false}
      />
    </div>
  );
}
