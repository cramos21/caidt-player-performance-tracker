// src/capacitor/SoccerBluetoothPlugin.ts
import { Capacitor, registerPlugin } from '@capacitor/core';

export interface SensorData { kicks: number; distance: number; maxSpeed: number; time: number; }
export interface BLEDevice { deviceId: string; name: string; rssi?: number; }

// Capacitor-style listener handle
type ListenerHandle = { remove: () => Promise<void> };

export interface SoccerBluetoothPlugin {
  initialize(): Promise<{ initialized: boolean }>;
  requestLEScan(): Promise<{ status: string }>;
  stopLEScan(): Promise<{ status: string }>;
  connect(options: { deviceId: string }): Promise<{ connected: boolean }>;
  getServices(): Promise<{ servicesRequested: boolean }>;

  // return a handle (some code calls .remove())
  addListener(eventName: 'scanResult', listenerFunc: (device: BLEDevice) => void): Promise<ListenerHandle>;
  addListener(eventName: 'connected', listenerFunc: (data: { deviceId: string }) => void): Promise<ListenerHandle>;
  addListener(eventName: 'servicesDiscovered', listenerFunc: (data: { deviceId: string; serviceCount: number }) => void): Promise<ListenerHandle>;
  addListener(eventName: 'bluetoothDisabled', listenerFunc: (data: { state: string }) => void): Promise<ListenerHandle>;
  addListener(eventName: 'scanStarted' | 'scanStopped', listenerFunc: () => void): Promise<ListenerHandle>;
  addListener(eventName: 'onSensorData', listenerFunc: (data: SensorData) => void): Promise<ListenerHandle>;
}

/* ---------- Web stub (browser only) ---------- */
type ListenerMap = {
  scanResult?: Array<(d: BLEDevice) => void>;
  connected?: Array<(d: { deviceId: string }) => void>;
  servicesDiscovered?: Array<(d: { deviceId: string; serviceCount: number }) => void>;
  bluetoothDisabled?: Array<(d: { state: string }) => void>;
  scanStarted?: Array<() => void>;
  scanStopped?: Array<() => void>;
  onSensorData?: Array<(d: SensorData) => void>;
};
const L: ListenerMap = {};
const on = <K extends keyof ListenerMap>(ev: K, cb: NonNullable<ListenerMap[K]>[number]): ListenerHandle => {
  (L[ev] ||= []).push(cb as any);
  return {
    remove: async () => {
      const arr = L[ev]; if (!arr) return;
      const i = arr.indexOf(cb as any); if (i >= 0) arr.splice(i, 1);
    }
  };
};
const emit = <K extends keyof ListenerMap>(ev: K, payload?: any) => (L[ev] || []).forEach(fn => (fn as any)(payload));

let bufferedScan: BLEDevice[] = [];
let lastDevice: BLEDevice | null = null;
let dataTimer: any = null;
let connectedOnce = false;
let autoConnectTimer: any = null;

const mkDevices = (): BLEDevice[] => ([
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
    emit('onSensorData', { kicks, distance: +distance.toFixed(2), maxSpeed: +maxSpeed.toFixed(2), time: secs });
  }, 1000);
};

const WebStub: SoccerBluetoothPlugin = {
  async initialize() { console.log('[WEB] SoccerBluetoothPlugin stub'); return { initialized: true }; },

  async requestLEScan() {
    emit('scanStarted');

    setTimeout(() => {
      const devs = mkDevices();
      bufferedScan = devs;
      lastDevice = devs[0];
      devs.forEach(d => emit('scanResult', d));
    }, 400);

    setTimeout(() => emit('scanStopped'), 1200);

    clearTimeout(autoConnectTimer);
    autoConnectTimer = setTimeout(() => {
      if (connectedOnce) return;
      const id = lastDevice?.deviceId || 'WEB-DEMO-1';
      connectedOnce = true;
      emit('connected', { deviceId: id });
      emit('servicesDiscovered', { deviceId: id, serviceCount: 1 });
      startFakeStream();
    }, 1500);

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
    const handle = on(eventName as keyof ListenerMap, listenerFunc);
    if (eventName === 'scanResult' && bufferedScan.length) bufferedScan.forEach(d => listenerFunc(d));
    return handle;
  },
};

/* ---------- Export: real plugin on iOS, stub on web ---------- */
const SoccerBluetooth =
  Capacitor.getPlatform() === 'web'
    ? WebStub
    : registerPlugin<SoccerBluetoothPlugin>('SoccerBluetoothPlugin');

export default SoccerBluetooth;