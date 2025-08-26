import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { BluetoothOff } from "lucide-react";

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
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-start gap-3 rounded-xl bg-slate-900/90 text-slate-100 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur">
        <BluetoothOff className="h-4 w-4 mt-0.5 opacity-80" />
        <div className="text-xs leading-snug">
          <strong className="font-semibold">Web demo</strong>: Bluetooth features
          are simulated in the browser. Connect a physical tracker in the iOS app.
        </div>
        <button
          className="ml-2 text-xs underline opacity-80 hover:opacity-100"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setHidden(true);
          }}
        >
          Hide
        </button>
      </div>
    </div>
  );
};

export default WebDemoBanner;