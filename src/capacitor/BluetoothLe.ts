// src/capacitor/BluetoothLe.ts
import { Capacitor, registerPlugin } from '@capacitor/core';

/** ===== Types ===== */
export interface SensorData { kicks: number; distance: number; maxSpeed: number; time: number; }
export interface BLEDevice { deviceId: string; name: string; rssi?: number; }
type ListenerHandle = { remove: () => Promise<void> };

export interface BluetoothLePlugin {
  initialize(): Promise<{ initialized: boolean }>;

  // scan
  requestLEScan(options?: any): Promise<{ status: string }>;
  stopLEScan(): Promise<{ status: string }>;

  // connect / services
  connect(options: { deviceId: string }): Promise<{ connected: boolean }>;
  disconnect?(options: { deviceId: string }): Promise<void>;
  getServices?(options: { deviceId: string }): Promise<{ services?: Array<{ uuid: string }> }>;

  // notify / read / write (community plugin style)
  startNotifications?(options: { deviceId: string; service: string; characteristic: string }): Promise<void>;
  stopNotifications?(options: { deviceId: string; service: string; characteristic: string }): Promise<void>;
  read?(options: { deviceId: string; service: string; characteristic: string }): Promise<{ value: string }>;
  write?(options: { deviceId: string; service: string; characteristic: string; value: Uint8Array }): Promise<void>;
  writeWithoutResponse?(options: { deviceId: string; service: string; characteristic: string; value: Uint8Array }): Promise<void>;

  // listeners (accept multiple event names for compat)
  addListener(eventName: string, listenerFunc: (payload: any) => void): Promise<ListenerHandle>;
}

/** ===== Utilities (web stub) ===== */
type ListenerMap = Record<string, Array<(p: any) => void>>;
const L: ListenerMap = {};
const on = (ev: string, cb: (p: any) => void): ListenerHandle => {
  (L[ev] ||= []).push(cb);
  return { remove: async () => {
    const arr = L[ev]; if (!arr) return;
    const i = arr.indexOf(cb); if (i >= 0) arr.splice(i, 1);
  }};
};
const emit = (ev: string, payload?: any) => (L[ev] || []).forEach(fn => fn(payload));
const hexLE32 = (n: number) => {
  const v = (Math.max(0, Math.floor(n)) >>> 0);
  return [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >> 24) & 255]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/** Match the app’s UUIDs (lowercased) */
const TRACKER_SERVICE = '12345678-1234-1234-1234-123456789abc';
const CHAR_KICKS      = '12345678-1234-1234-1234-123456789001';
const CHAR_DIST       = '12345678-1234-1234-1234-123456789002';
const CHAR_SPEED      = '12345678-1234-1234-1234-123456789003';
const CHAR_TIME       = '12345678-1234-1234-1234-123456789004';
const CHAR_CMD        = '12345678-1234-1234-1234-123456789005';

/** Demo devices for the web */
const mkDevices = (): BLEDevice[] => ([
  { deviceId: 'WEB-DEMO-1', name: 'Arduino Nano 33 BLE Sense', rssi: -40 },
  { deviceId: 'WEB-DEMO-2', name: 'Soccer Tracker', rssi: -55 },
]);

/** Live values for the web stub */
const state = {
  connectedId: null as string | null,
  kicks: 0,
  distanceM: 0,     // meters
  speed10: 0,       // km/h * 10 (matches app’s divide by 10)
  seconds: 0,
};
let dataTimer: any = null;
let autoConnectTimer: any = null;
let lastScanResults: BLEDevice[] = [];
const resetSession = () => { state.kicks = 0; state.distanceM = 0; state.speed10 = 0; state.seconds = 0; };

/** Emit one “notification” like the device would */
const emitChar = (characteristic: string, valueHexLE32: string) => {
  const payload = {
    value: valueHexLE32,                       // hex (app converts from base64 OR accepts hex)
    characteristic,
    service: TRACKER_SERVICE,
    deviceId: state.connectedId || 'WEB-DEMO-1',
  };
  emit('onRead', payload);                     // some code listens to onRead
  emit('onNotify', payload);                   // some code listens to onNotify
  emit('onCharacteristicValueChanged', payload);
};

const startFakeStream = () => {
  clearInterval(dataTimer);
  const t0 = Date.now();
  dataTimer = setInterval(() => {
    // simple demo physics
    const secs = Math.round((Date.now() - t0) / 1000);
    state.seconds = secs;

    // vary speed between 3–7 km/h
    const speed = 3 + Math.random() * 4;
    state.speed10 = Math.round(speed * 10);

    // distance += speed(km/h) -> m/s -> meters per tick (1s)
    state.distanceM += Math.round((speed * 1000) / 3600);

    // random kick
    if (Math.random() < 0.3) state.kicks += 1;

    // emit like a real peripheral (hex LE32 per characteristic)
    emitChar(CHAR_KICKS, hexLE32(state.kicks));
    emitChar(CHAR_DIST,  hexLE32(state.distanceM));
    emitChar(CHAR_SPEED, hexLE32(state.speed10));
    emitChar(CHAR_TIME,  hexLE32(state.seconds));
  }, 1000);
};

/** Web stub implementation */
const WebStub: BluetoothLePlugin = {
  async initialize() { return { initialized: true }; },

  async requestLEScan() {
    emit('scanStarted');
    lastScanResults = mkDevices();
    // emit immediately & again shortly so late listeners still see it
    lastScanResults.forEach(d => emit('onScanResult', d));
    setTimeout(() => lastScanResults.forEach(d => emit('onScanResult', d)), 300);
    setTimeout(() => emit('scanStopped'), 1200);

    // auto-connect once if the UI never calls connect()
    clearTimeout(autoConnectTimer);
    autoConnectTimer = setTimeout(() => {
      if (state.connectedId) return;
      const id = lastScanResults[0]?.deviceId || 'WEB-DEMO-1';
      state.connectedId = id;
      emit('connected', { deviceId: id });
      emit('servicesDiscovered', { deviceId: id, serviceCount: 1 });
      startFakeStream();
    }, 1500);

    return { status: 'ok' };
  },

  async stopLEScan() { emit('scanStopped'); return { status: 'ok' }; },

  async connect({ deviceId }) {
    clearTimeout(autoConnectTimer);
    state.connectedId = deviceId || lastScanResults[0]?.deviceId || 'WEB-DEMO-1';
    emit('connected', { deviceId: state.connectedId });
    emit('servicesDiscovered', { deviceId: state.connectedId, serviceCount: 1 });
    startFakeStream();
    return { connected: true };
  },

  async disconnect() {
    clearInterval(dataTimer);
    dataTimer = null;
    const id = state.connectedId;
    state.connectedId = null;
    if (id) emit('onDisconnected', { deviceId: id });
  },

  async getServices() {
    return { services: [{ uuid: TRACKER_SERVICE }] };
  },

  async startNotifications() { /* no-op on web stub */ },
  async stopNotifications() { /* no-op on web stub */ },

  async read({ characteristic }) {
    // return the current value for polling paths
    let valueHex = '00000000';
    switch ((characteristic || '').toLowerCase()) {
      case CHAR_KICKS: valueHex = hexLE32(state.kicks); break;
      case CHAR_DIST:  valueHex = hexLE32(state.distanceM); break;
      case CHAR_SPEED: valueHex = hexLE32(state.speed10); break;
      case CHAR_TIME:  valueHex = hexLE32(state.seconds); break;
    }
    return { value: valueHex };
  },

  async write({ characteristic, value }) {
    // handle reset command (value=1)
    if ((characteristic || '').toLowerCase() === CHAR_CMD) {
      const first = value?.[0] ?? 0;
      if (first === 1) resetSession();
    }
  },

  async writeWithoutResponse(opts) { return this.write!(opts); },

  async addListener(eventName: string, listenerFunc: (payload: any) => void) {
    return on(eventName, listenerFunc);
  },
};

/** Export: native on device, stub on web */
const BluetoothLe: BluetoothLePlugin =
  Capacitor.getPlatform() === 'web'
    ? WebStub
    // IMPORTANT: use your native plugin name (matches @objc(SoccerBluetoothPlugin))
    : registerPlugin<BluetoothLePlugin>('SoccerBluetoothPlugin');

export { BluetoothLe };
export default BluetoothLe;