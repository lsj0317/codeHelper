"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseUnitProps {
  /** AdSense ad slot ID (e.g., "1234567890") */
  slot: string;
  /** Ad format: "auto", "rectangle", "vertical", "horizontal" */
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  /** Layout key for in-feed/in-article ads */
  layoutKey?: string;
  /** Ad layout type */
  layout?: string;
  /** Responsive sizing */
  responsive?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Fixed width style */
  style?: React.CSSProperties;
}

export function AdSenseUnit({
  slot,
  format = "auto",
  layoutKey,
  layout,
  responsive = true,
  className = "",
  style,
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch {
      // AdSense not loaded yet (dev environment)
    }
  }, []);

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive && { "data-full-width-responsive": "true" })}
        {...(layoutKey && { "data-ad-layout-key": layoutKey })}
        {...(layout && { "data-ad-layout": layout })}
      />
    </div>
  );
}
