// src/setup/ViewportMeta.tsx
import { useEffect } from "react";

export default function ViewportMeta() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    // Enables env(safe-area-inset-*) inside the WKWebView
    meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
  }, []);
  return null;
}