// src/capacitor/BluetoothLe.ts  (or your existing path)
import { Capacitor, registerPlugin } from '@capacitor/core';

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

// ===== Web stub (only used when running in a browser) =====
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
const emit = <K extends keyof ListenerMap>(ev: K, payload?: Parameters<NonNullable<ListenerMap[K]>[number]>[0]) => {
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

const WebStub: BluetoothLePlugin = {
  async initialize() { return { initialized: true }; },

  async requestLEScan() {
    emit('scanStarted');

    // Give the UI a moment to set up listeners, then emit results
    setTimeout(() => {
      const devs = makeDevices();
      bufferedScan = devs;
      lastDevice = devs[0];
      // Emit both so any filter (Arduino/Soccer) matches
      devs.forEach(d => emit('scanResult', d));
    }, 600);

    // Stop scan a bit later so UIs that wait for scanStopped can proceed
    setTimeout(() => emit('scanStopped'), 3000);

    // Auto-connect fallback: if UI never calls connect(), simulate it
    clearTimeout(autoConnectTimer);
    autoConnectTimer = setTimeout(() => {
      if (connectedOnce) return;
      const id = (lastDevice?.deviceId) || 'WEB-DEMO-1';
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
    // If they subscribe after scan, replay the buffered devices
    if (eventName === 'scanResult' && bufferedScan.length) {
      bufferedScan.forEach(d => listenerFunc(d));
    }
  },
};

// Use the real native plugin on iOS; stub on web
const SoccerBluetooth =
  Capacitor.getPlatform() === 'web'
    ? WebStub
    : registerPlugin<BluetoothLePlugin>('SoccerBluetooth');

export default SoccerBluetooth;