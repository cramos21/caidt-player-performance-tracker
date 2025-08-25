import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Body-level fullscreen overlay with gradient background and safe-area padding.
 * Renders above the app shell & bottom nav.
 */
export default function FullscreenOverlay({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  if (!hostRef.current) {
    const host = document.createElement("div");
    host.className =
      "fixed inset-0 z-[2147483647] w-screen h-[100dvh] " +
      "bg-gradient-to-br from-app-bg-from via-app-bg-via to-app-bg-to";
    host.style.boxSizing = "border-box";
    // Tight top padding (safe-area + 24px)
    host.style.paddingTop = "calc(env(safe-area-inset-top, 0px) + 24px)";
    // Room for home indicator
    host.style.paddingBottom = "calc(env(safe-area-inset-bottom, 0px) + 16px)";
    host.style.overflow = "hidden";
    hostRef.current = host;
  }

  useEffect(() => {
    const host = hostRef.current!;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.appendChild(host);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeChild(host);
    };
  }, []);

  return createPortal(<div className="w-screen h-full">{children}</div>, hostRef.current!);
}