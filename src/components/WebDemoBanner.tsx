import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { BluetoothOff, X } from "lucide-react";

const isWeb = Capacitor.getPlatform() === "web";
const STORAGE_KEY = "pptracker:hide-web-banner";

const WebDemoBanner: React.FC = () => {
  if (!isWeb) return null;

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // show unless user previously hid it
    setHidden(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (hidden) return null;

  return (
    // Full width of the content column:
    // - center it with left-1/2 & -translate-x-1/2
    // - width is screen minus 2rem (matches px-4 container padding)
    // - max-w-sm to match your cards
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-28 w-[calc(100%-2rem)] max-w-sm z-50"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-full rounded-xl bg-slate-900/90 text-slate-100 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur">
        <button
          aria-label="Hide web demo notice"
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-white/10"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setHidden(true);
          }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <BluetoothOff className="h-4 w-4 mt-0.5 opacity-80 shrink-0" />
          <div className="text-xs leading-snug">
            <strong className="font-semibold">Web demo</strong>: Bluetooth features
            are simulated in the browser. Connect a physical tracker in the iOS app.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDemoBanner;