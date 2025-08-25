// src/capacitor/BluetoothLe.ts
import { Capacitor, registerPlugin } from '@capacitor/core';

// ---- types (unchanged) ----
export interface SensorData { kicks: number; distance: number; maxSpeed: number; time: number; }
export interface BLEDevice { deviceId: string; name: string; rssi?: number; }

export interface BluetoothLePlugin {
  initialize(): Promise<{ initialized: boolean }>;
  requestLEScan(): Promise<{ status: string }>;
  stopLEScan(): Promise<{ status: string }>;
  connect(options: { deviceId: string }): Promise<{ connected: boolean }>;
  getServices(): Promise<{ servicesRequested: boolean }>;

  addListener(eventName: 'scanResult', listenerFunc: (device: BLEDevice) => void): Promise<void>;
  addListener(eventName: 'connected', listenerFunc: (data: { deviceId: string }) => void): Promise<void>;
  addListener(eventName: 'servicesDiscovered', listenerFunc: (data: { deviceId: string; serviceCount: number }) => void): Promise<void>;
  addListener(eventName: 'bluetoothDisabled', listenerFunc: (data: { state: string }) => void): Promise<void>;
  addListener(eventName: 'scanStarted' | 'scanStopped', listenerFunc: () => void): Promise<void>;
  addListener(eventName: 'onSensorData', listenerFunc: (data: SensorData) => void): Promise<void>;
}

// ---- web stub helpers ----
type ListenerMap = {
  scanResult?: Array<(d: BLEDevice) => void>;
  connected?: Array<(d: { deviceId: string }) => void>;
  servicesDiscovered?: Array<(d: { deviceId: string; serviceCount: number }) => void>;
  bluetoothDisabled?: Array<(d: { state: string }) => void>;
  scanStarted?: Array<() => void>;
  scanStopped?: Array<() => void>;
  onSensorData?: Array<(d: SensorData) => void>;
};

const listeners: ListenerMap = {};
const on = <K extends keyof ListenerMap>(ev: K, cb: NonNullable<ListenerMap[K]>[number]) => {
  (listeners[ev] ||= []).push(cb as any);
};
const emit = <K extends keyof ListenerMap>(ev: K, payload?: any) => {
  (listeners[ev] || []).forEach(fn => (fn as any)(payload));
};

let bufferedScan: BLEDevice[] = [];
let lastDevice: BLEDevice | null = null;
let dataTimer: any = null;
let connectedOnce = false;
let autoConnectTimer: any = null;

const makeDevices = (): BLEDevice[] => ([
  { deviceId: 'WEB-DEMO-1', name: 'Arduino Nano 33 BLE Sense', rssi: -40 },
  { deviceId: 'WEB-DEMO-2', name: 'Soccer Tracker', rssi: -55 },
]);

const startFakeStream = () => {
  if (dataTimer) clearInterval(dataTimer);
  let kicks = 0, distance = 0, maxSpeed = 0;
  const t0 = Date.now();
  dataTimer = setInterval(() => {
    const secs = Math.round((Date.now() - t0) / 1000);
    const speed = 3 + Math.random() * 4; // 3–7 m/s
    maxSpeed = Math.max(maxSpeed, speed);
    distance += speed;
    if (Math.random() < 0.3) kicks += 1;
    emit('onSensorData', {
      kicks,
      distance: Number(distance.toFixed(2)),
      maxSpeed: Number(maxSpeed.toFixed(2)),
      time: secs,
    });
  }, 1000);
};

// ---- web stub implementation ----
const WebStub: BluetoothLePlugin = {
  async initialize() {
    if (typeof window !== 'undefined') {
      // quick debug marker in browser console
      console.log('[WEB] BluetoothLe stub active');
    }
    return { initialized: true };
  },

  async requestLEScan() {
    emit('scanStarted');

    // Emit fake devices shortly after, so listeners see them
    setTimeout(() => {
      const devs = makeDevices();
      bufferedScan = devs;
      lastDevice = devs[0];
      devs.forEach(d => emit('scanResult', d));
    }, 600);

    // Some flows wait for scanStopped
    setTimeout(() => emit('scanStopped'), 3000);

    // If UI never calls connect(), auto-connect so data appears
    clearTimeout(autoConnectTimer);
    autoConnectTimer = setTimeout(() => {
      if (connectedOnce) return;
      const id = lastDevice?.deviceId || 'WEB-DEMO-1';
      connectedOnce = true;
      emit('connected', { deviceId: id });
      emit('servicesDiscovered', { deviceId: id, serviceCount: 1 });
      startFakeStream();
    }, 1800);

    return { status: 'ok' };
  },

  async stopLEScan() { emit('scanStopped'); return { status: 'ok' }; },

  async connect({ deviceId }) {
    const id = deviceId || lastDevice?.deviceId || 'WEB-DEMO-1';
    clearTimeout(autoConnectTimer);
    if (!connectedOnce) {
      connectedOnce = true;
      emit('connected', { deviceId: id });
      emit('servicesDiscovered', { deviceId: id, serviceCount: 1 });
      startFakeStream();
    }
    return { connected: true };
  },

  async getServices() { return { servicesRequested: true }; },

  async addListener(eventName: any, listenerFunc: any) {
    on(eventName as keyof ListenerMap, listenerFunc);
    // Late subscribers still get devices
    if (eventName === 'scanResult' && bufferedScan.length) {
      bufferedScan.forEach(d => listenerFunc(d));
    }
  },
};

// ---- export: real plugin on iOS, stub on web ----
// NOTE: native name here is 'SoccerBluetooth' (older wrapper)
const BluetoothLe =
  Capacitor.getPlatform() === 'web'
    ? WebStub
    : registerPlugin<BluetoothLePlugin>('SoccerBluetooth');

export default BluetoothLe;