"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";

const MiniGameOverlay = lazy(() => import("./MiniGameOverlay"));

interface MiniGameZoneProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Stabiele wrapper om de easter-egg minigame (zie MiniGameOverlay.tsx voor
 * de game zelf). De children renderen altijd direct — geen remount of
 * flikkering — en de game-code laadt als apart chunk zodra de browser idle
 * is, en alléén op desktop met muis zonder prefers-reduced-motion. Mobiel
 * downloadt de game dus helemaal niet.
 */
export function MiniGameZone({ children, className = "" }: MiniGameZoneProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.innerWidth < 1024) return;

    const arm = () => setArmed(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(arm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(arm, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={zoneRef} className={`relative ${className}`}>
      {children}
      {armed && (
        <Suspense fallback={null}>
          <MiniGameOverlay zoneRef={zoneRef} />
        </Suspense>
      )}
    </div>
  );
}
