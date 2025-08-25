// src/capacitor/ble-listener.ts
// Robust bridge: turns Capacitor BLE notifications/reads into window "tracker-data" events
// and makes sure notifications are started for your 4 characteristics.
// Also includes a light polling fallback (1s) in case notifications don't fire on a device.

import { BluetoothLe } from "@capacitor-community/bluetooth-le";

// === Your UUIDs (lowercase) ===
const SERVICE = "12345678-1234-1234-1234-123456789abc".toLowerCase();
const CHARS = {
  KICKS: "12345678-1234-1234-1234-123456789001".toLowerCase(),
  DIST:  "12345678-1234-1234-1234-123456789002".toLowerCase(),
  MAX:   "12345678-1234-1234-1234-123456789003".toLowerCase(),
  TIME:  "12345678-1234-1234-1234-123456789004".toLowerCase(),
} as const;

declare global {
  interface Window {
    __bleListenerAttached?: boolean;
  }
}

let lastDeviceId: string | null = null;
let pollTimer: any = null;

function dispatchTrackerData(characteristic: string, payload: Record<string, any>) {
  try {
    window.dispatchEvent(
      new CustomEvent("tracker-data", {
        detail: { characteristic, ...payload },
      })
    );
  } catch {
    /* no-op */
  }
}

async function ensureNotifications(deviceId: string) {
  // Start notifications for all characteristics (safe to call repeatedly)
  const start = (c: string) =>
    BluetoothLe.startNotifications({ deviceId, service: SERVICE, characteristic: c }).catch(() => {});
  await Promise.all([start(CHARS.KICKS), start(CHARS.DIST), start(CHARS.MAX), start(CHARS.TIME)]);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function startPolling() {
  stopPolling();
  if (!lastDeviceId) return;

  // Read each characteristic every 1s as a fallback if notifications don’t arrive
  pollTimer = setInterval(async () => {
    const dev = lastDeviceId!;
    const read = async (c: string) => {
      try {
        const res: any = await BluetoothLe.read({ deviceId: dev, service: SERVICE, characteristic: c });
        if (res?.value || res?.hex || res?.bytes || res?.buffer) {
          dispatchTrackerData(c, {
            value: res?.value ?? null,   // base64
            hex: res?.hex ?? null,
            bytes: res?.bytes ?? null,
            buffer: res?.buffer ?? null,
            deviceId: dev,
          });
        }
      } catch {
        /* ignore */
      }
    };
    await Promise.all([read(CHARS.KICKS), read(CHARS.DIST), read(CHARS.MAX), read(CHARS.TIME)]);
  }, 1000);
}

function attachOnce() {
  if (typeof window === "undefined" || window.__bleListenerAttached) return;
  window.__bleListenerAttached = true;

  // Track connection so we know the deviceId and can start notifications
  BluetoothLe.addListener("onConnected", (ev: any) => {
    lastDeviceId = ev?.device?.deviceId ?? ev?.deviceId ?? null;
    if (lastDeviceId) {
      ensureNotifications(lastDeviceId);
      startPolling(); // harmless alongside notifications
    }
  });

  BluetoothLe.addListener("onDisconnected", () => {
    lastDeviceId = null;
    stopPolling();
  });

  // Forward notifications to the app (common event name)
  const forward = (result: any) => {
    const characteristic = String(result?.characteristic ?? result?.characteristicUuid ?? "").toLowerCase();
    if (!characteristic) return;
    dispatchTrackerData(characteristic, {
      value: result?.value ?? null, // base64
      hex: result?.hex ?? null,
      bytes: result?.bytes ?? null,
      buffer: result?.buffer ?? null,
      deviceId: lastDeviceId,
    });
  };

  BluetoothLe.addListener("onNotify", forward as any);

  // Extra fallbacks for older/different plugin builds (won’t hurt if they never fire)
  BluetoothLe.addListener("onCharacteristicValueChange" as any, forward as any);
  BluetoothLe.addListener("onValueChanged" as any, forward as any);
}

attachOnce();