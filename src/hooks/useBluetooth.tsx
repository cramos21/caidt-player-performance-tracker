/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PluginListenerHandle } from "@capacitor/core";

// IMPORTANT: use our wrapper (native on iOS, stub on web)
import { BluetoothLe } from "@/capacitor/BluetoothLe";

/** ====== Tracker UUIDs (keep lowercased) ====== */
const TRACKER_SERVICE = "12345678-1234-1234-1234-123456789abc";
const CHAR_STATUS     = "12345678-1234-1234-1234-123456789001";
const CHAR_DATA_1     = "12345678-1234-1234-1234-123456789002";
const CHAR_DATA_2     = "12345678-1234-1234-1234-123456789003";
const CHAR_COMMAND    = "12345678-1234-1234-1234-123456789004";

/** Persist last device id */
const LAST_DEVICE_KEY = "pptracker:lastDeviceId";
const saveLastDevice = (id: string) => { try { localStorage.setItem(LAST_DEVICE_KEY, id); } catch {} };
const getLastDevice  = () => { try { return localStorage.getItem(LAST_DEVICE_KEY); } catch { return null; } };

/** ====== Types / helpers ====== */
export type ScanDevice = {
  deviceId: string;
  name?: string;
  localName?: string;
  rssi?: number;
  uuids?: string[];
};

const isTrackerAdvertising = (d: Partial<ScanDevice>) =>
  !!(
    d?.name?.toLowerCase().includes("arduino") ||
    d?.localName?.toLowerCase?.().includes("player performance tracker") ||
    (d?.uuids ?? []).map((u) => u?.toLowerCase?.()).includes(TRACKER_SERVICE)
  );

const toHex = (v?: string): string | undefined => {
  if (!v) return undefined;
  const looksBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(v) && v.length % 4 === 0;
  if (looksBase64) {
    try {
      const bin = atob(v);
      let out = "";
      for (let i = 0; i < bin.length; i++) out += bin.charCodeAt(i).toString(16).padStart(2, "0");
      return out.toLowerCase();
    } catch {/* ignore */}
  }
  return v.replace(/\s+/g, "").toLowerCase();
};

/** ====== Context ====== */
type BluetoothContextType = {
  isScanning: boolean;
  isConnected: boolean;
  isReady: boolean;
  devices: ScanDevice[];
  connectedDevice?: ScanDevice | null;

  scanForDevices: (opts?: { timeoutMs?: number; keepExisting?: boolean }) => Promise<ScanDevice[]>;
  connectToDevice: (deviceId?: string) => Promise<void>;
  connectQuick: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearDevices: () => void;
  sendCommand: (data: Uint8Array | string) => Promise<void>;

  debugInfo: string[];
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

/** Helper: add listener for several possible event names (native vs stub) */
async function addAnyListener(
  names: string[],
  cb: (evt: any) => void
): Promise<PluginListenerHandle> {
  const handles: PluginListenerHandle[] = [];
  for (const n of names) {
    try {
      const h = await (BluetoothLe as any).addListener(n, cb);
      if (h && typeof h.remove === "function") handles.push(h);
    } catch {
      // event name not supported — ignore
    }
  }
  return {
    remove: async () => {
      await Promise.all(handles.map((h) => h?.remove?.()));
    },
  } as PluginListenerHandle;
}

/** ====== Provider ====== */
export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScanning, setIsScanning]     = useState(false);
  const [isConnected, setIsConnected]   = useState(false);
  const [isReady, setIsReady]           = useState(false);
  const [devices, setDevices]           = useState<ScanDevice[]>([]);
  const [connectedDevice, setConnected] = useState<ScanDevice | null>(null);
  const [debugInfo, setDebug]           = useState<string[]>([]);

  const scanSubRef     = useRef<PluginListenerHandle | null>(null);
  const readSubRef     = useRef<PluginListenerHandle | null>(null);
  const discSubRef     = useRef<PluginListenerHandle | null>(null);

  const initializedRef = useRef(false);
  const connectedIdRef = useRef<string | null>(null);
  const connectingRef  = useRef(false);

  /** single-flight scan */
  const scanPromiseRef = useRef<Promise<ScanDevice[]> | null>(null);

  const didAutoReconnectRef = useRef(false);

  const log = (msg: string) =>
    setDebug((prev) => [...prev.slice(-199), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  /** Init once */
  const ensureInitialized = useCallback(async () => {
    if (initializedRef.current) return;
    try {
      await (BluetoothLe as any).initialize?.();
      initializedRef.current = true;
      log("✅ BLE initialized");
    } catch (e) {
      log(`❗ initialize error: ${String(e)}`);
    }
  }, []);

  /** ====== Scan (single-flight) ====== */
  const scanForDevices: BluetoothContextType["scanForDevices"] = useCallback(async (opts) => {
    const timeoutMs = opts?.timeoutMs ?? 5000;
    const keepExisting = !!opts?.keepExisting;

    if (scanPromiseRef.current) return scanPromiseRef.current;

    const promise = (async () => {
      await ensureInitialized();
      if (!keepExisting) setDevices([]);

      const localMap = new Map<string, ScanDevice>();

      try { await scanSubRef.current?.remove(); } catch {}
      // Listen to both native & stub event names
      scanSubRef.current = await addAnyListener(
        ["onScanResult", "scanResult"],
        (res: any) => {
          const dev: ScanDevice = {
            deviceId: res?.device?.deviceId ?? res?.deviceId,
            name: res?.device?.name ?? res?.name,
            localName: res?.localName,
            rssi: res?.rssi,
            uuids: res?.uuids?.map((u: string) => u?.toLowerCase?.()),
          };
          if (!dev.deviceId) return;

          const prev = localMap.get(dev.deviceId) || {};
          localMap.set(dev.deviceId, { ...prev, ...dev });

          setDevices((prevState) => {
            const idx = prevState.findIndex((p) => p.deviceId === dev.deviceId);
            if (idx >= 0) {
              const copy = prevState.slice();
              copy[idx = idx] = { ...copy[idx], ...dev };
              return copy;
            }
            return [...prevState, dev];
          });

          if (isTrackerAdvertising(dev)) {
            log(`📱 Found tracker: ${dev.name ?? dev.localName ?? "Unknown"} (${dev.deviceId.slice(0, 8)}…)`);
          }
        }
      );

      setIsScanning(true);
      log("🔍 Starting BLE scan…");
      try {
        await (BluetoothLe as any).requestLEScan?.({
          services: [TRACKER_SERVICE],
          allowDuplicates: true,
        });
      } catch (e) {
        log(`❗ requestLEScan error: ${String(e)}`);
      }

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          try { await (BluetoothLe as any).stopLEScan?.(); } catch {}
          setIsScanning(false);
          try { await scanSubRef.current?.remove(); } catch {}
          scanSubRef.current = null;
          log("🛑 Scan stopped");
          resolve();
        }, timeoutMs);
      });

      const trackers = Array.from(localMap.values()).filter(isTrackerAdvertising);
      log(`🏁 Scan done — ${trackers.length} tracker(s)`);
      return trackers;
    })();

    scanPromiseRef.current = promise;
    try {
      return await promise;
    } finally {
      scanPromiseRef.current = null;
    }
  }, [ensureInitialized]);

  /** ====== Notifications ====== */
  const handleStatusNotification = (hex?: string) => {
    if (!hex) return;
    if (hex !== "00000000") {
      if (!isReady) log(`✅ First status packet (${hex}) — ready`);
      setIsReady(true);
    }
  };

  const attachNotificationListener = useCallback(async () => {
    try { await readSubRef.current?.remove(); } catch {}
    // Support multiple event names from different implementations
    readSubRef.current = await addAnyListener(
      ["onRead", "onNotify", "onCharacteristicValueChanged"],
      (evt: any) => {
        const hex = toHex(evt?.value);
        handleStatusNotification(hex);

        if (hex) {
          window.dispatchEvent(
            new CustomEvent("tracker-data", {
              detail: {
                hex,
                characteristic: String(evt?.characteristic || "").toLowerCase(),
                service: String(evt?.service || "").toLowerCase(),
              },
            })
          );
        }
      }
    );
  }, [isReady]);

  const attachDisconnectListener = useCallback(async () => {
    try { await discSubRef.current?.remove(); } catch {}
    discSubRef.current = await addAnyListener(
      ["onDisconnected", "onDisconnect"],
      (evt: any) => {
        const id = evt?.deviceId;
        if (id && id === connectedIdRef.current) {
          log("🔌 Disconnected by OS/peripheral");
          connectedIdRef.current = null;
          setIsConnected(false);
          setIsReady(false);
          setConnected(null);
        }
      }
    );
  }, []);

  /** ====== Connect (robust, discovery-first) ====== */
  const connectToDevice: BluetoothContextType["connectToDevice"] = useCallback(async (deviceIdParam?: string) => {
    // already connected?
    if (connectedIdRef.current) {
      log("🔗 Already connected — skipping connect()");
      setIsConnected(true);
      return;
    }
    if (connectingRef.current) {
      log("⏳ connect already in progress");
      return;
    }
    connectingRef.current = true;

    await ensureInitialized();
    try { await (BluetoothLe as any).stopLEScan?.(); } catch {}

    let deviceId = deviceIdParam || connectedIdRef.current || getLastDevice() || undefined;

    // If we don't have a discovered device in memory, do a short discovery pass.
    const knownInThisRun = deviceId ? devices.some(d => d.deviceId === deviceId) : false;
    if (!deviceId || !knownInThisRun) {
      log("🔍 Discovery scan before connect…");
      const found = await scanForDevices({ timeoutMs: 3500, keepExisting: true });
      if (!deviceId) {
        deviceId = found[0]?.deviceId;
      } else if (!found.some(d => d.deviceId === deviceId)) {
        log("⚠️ Saved device not seen in scan; will still try to connect after discovery.");
      }
    }

    if (!deviceId) {
      connectingRef.current = false;
      log("⚠️ connectToDevice: no device found after scan");
      throw new Error("No tracker found");
    }

    const tryConnect = async () => {
      log(`🔗 Connecting to ${deviceId}…`);
      await (BluetoothLe as any).connect({ deviceId });
    };

    try {
      await tryConnect();
    } catch (e: any) {
      const msg = String(e?.message || e || "");
      if (/device not found|requestlescan|getdevices/i.test(msg)) {
        log("⚠️ Connect failed: device not found. Rescanning then retrying once…");
        try { await scanForDevices({ timeoutMs: 4000, keepExisting: true }); } catch {}
        await tryConnect();
      } else {
        connectingRef.current = false;
        log(`❗ connect error: ${msg}`);
        throw e;
      }
    }

    // success
    connectedIdRef.current = deviceId;
    saveLastDevice(deviceId);

    setIsConnected(true);
    setIsReady(false);

    const foundMeta = devices.find((d) => d.deviceId === deviceId) ?? { deviceId, name: "Tracker" };
    setConnected(foundMeta);

    try {
      const svc = await (BluetoothLe as any).getServices?.({ deviceId });
      log(`🧭 Services: ${JSON.stringify(svc?.services?.map((s: any) => s.uuid)?.slice?.(0, 3))}`);
    } catch {}

    await attachNotificationListener();
    await attachDisconnectListener();

    const startNotif = async (characteristic: string) => {
      try {
        await (BluetoothLe as any).startNotifications?.({
          deviceId,
          service: TRACKER_SERVICE,
          characteristic,
        });
        log(`🔔 Notifications ON for ${characteristic.slice(-4)}`);
      } catch (err) {
        log(`❗ startNotifications ${characteristic.slice(-4)} failed: ${String(err)}`);
      }
    };

    await startNotif(CHAR_STATUS);
    await startNotif(CHAR_DATA_1);
    await startNotif(CHAR_DATA_2);
    await startNotif(CHAR_COMMAND);

    try { window.dispatchEvent(new CustomEvent("tracker-connected")); } catch {}
    log("✅ Connected and listening");

    connectingRef.current = false;
  }, [attachDisconnectListener, attachNotificationListener, devices, ensureInitialized, scanForDevices]);

  const connectQuick = useCallback(async () => connectToDevice(), [connectToDevice]);

  /** ====== Disconnect ====== */
  const disconnect = useCallback(async () => {
    const id = connectedIdRef.current;
    if (!id) return;
    log(`🔌 Disconnecting ${id}…`);
    try {
      const chars = [CHAR_STATUS, CHAR_DATA_1, CHAR_DATA_2, CHAR_COMMAND];
      for (const c of chars) {
        try {
          await (BluetoothLe as any).stopNotifications?.({ deviceId: id, service: TRACKER_SERVICE, characteristic: c });
        } catch {}
      }
      await (BluetoothLe as any).disconnect?.({ deviceId: id });
    } finally {
      connectedIdRef.current = null;
      setIsConnected(false);
      setIsReady(false);
      setConnected(null);
      try { await readSubRef.current?.remove(); } catch {}
      readSubRef.current = null;
      log("🔌 Disconnected");
    }
  }, []);

  /** ====== Write ====== */
  const sendCommand: BluetoothContextType["sendCommand"] = useCallback(async (data) => {
    const id = connectedIdRef.current;
    if (!id) throw new Error("Not connected");

    const toBytes = (d: Uint8Array | string) => {
      if (typeof d !== "string") return d;
      const hex = d.replace(/\s+/g, "");
      if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2) throw new Error("sendCommand: invalid hex string");
      const arr = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.substr(i, 2), 16);
      return arr;
    };

    const bytes = toBytes(data);
    try {
      await (BluetoothLe as any).write?.({ deviceId: id, service: TRACKER_SERVICE, characteristic: CHAR_COMMAND, value: bytes });
      log(`📤 Wrote ${bytes.length}B to CMD`);
    } catch (e) {
      try {
        await (BluetoothLe as any).writeWithoutResponse?.({ deviceId: id, service: TRACKER_SERVICE, characteristic: CHAR_COMMAND, value: bytes });
        log(`📤 Wrote (no resp) ${bytes.length}B to CMD`);
      } catch (e2) {
        log(`❗ write failed: ${String(e2)}`);
        throw e2;
      }
    }
  }, []);

  /** ====== Misc ====== */
  const clearDevices = useCallback(() => setDevices([]), []);

  // Mount: init + one-time soft auto-reconnect
  useEffect(() => {
    (async () => {
      await ensureInitialized();
      if (didAutoReconnectRef.current) return;
      didAutoReconnectRef.current = true;

      const last = getLastDevice();
      if (last) {
        try {
          await connectToDevice(last);
        } catch {
          // ignore; user can connect manually
        }
      }
    })();

    // Clear listeners on unmount
    return () => {
      try { scanSubRef.current?.remove(); } catch {}
      try { readSubRef.current?.remove(); } catch {}
      try { discSubRef.current?.remove(); } catch {}
    };
  }, [connectToDevice, ensureInitialized]);

  const value = useMemo<BluetoothContextType>(
    () => ({
      isScanning,
      isConnected,
      isReady,
      devices,
      connectedDevice,

      scanForDevices,
      connectToDevice,
      connectQuick,
      disconnect,
      clearDevices,
      sendCommand,

      debugInfo,
    }),
    [
      isScanning,
      isConnected,
      isReady,
      devices,
      connectedDevice,
      scanForDevices,
      connectToDevice,
      connectQuick,
      disconnect,
      clearDevices,
      sendCommand,
      debugInfo,
    ]
  );

  return <BluetoothContext.Provider value={value}>{children}</BluetoothContext.Provider>;
};

/** ====== Hook ====== */
export const useBluetooth = (): BluetoothContextType => {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error("useBluetooth must be used within a BluetoothProvider");
  return ctx;
};

export default BluetoothProvider;