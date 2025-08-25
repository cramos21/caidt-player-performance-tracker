// src/BluetoothLe.ts
import { Capacitor, registerPlugin } from '@capacitor/core';

export interface SensorData {
  kicks: number;
  distance: number;
  maxSpeed: number;
  time: number;
}

export interface BLEDevice {
  deviceId: string;
  name: string;
  rssi?: number;
}

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

// ----------------------
// Web stub (Vercel only)
// ----------------------
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

const WebStub: BluetoothLePlugin = {
  async initialize() { return { initialized: true }; },

  async requestLEScan() {
    emit('scanStarted');
    // Simulate finding one device, then stop scan
    setTimeout(() => {
      emit('scanResult', { deviceId: 'WEB-DEMO', name: 'Soccer Tracker (Web Demo)', rssi: -55 });
      emit('scanStopped');
    }, 700);
    return { status: 'ok' };
  },

  async stopLEScan() { emit('scanStopped'); return { status: 'ok' }; },

  async connect({ deviceId }) {
    // Pretend we connected
    setTimeout(() => {
      emit('connected', { deviceId });
      emit('servicesDiscovered', { deviceId, serviceCount: 1 });

      // Stream fake sensor data every second
      let kicks = 0, distance = 0, maxSpeed = 0;
      const start = Date.now();
      setInterval(() => {
        const t = (Date.now() - start) / 1000;
        const speed = 3 + Math.random() * 4;       // 3–7 m/s
        maxSpeed = Math.max(maxSpeed, speed);
        distance += speed;
        if (Math.random() < 0.3) kicks += 1;

        emit('onSensorData', {
          kicks,
          distance: Number(distance.toFixed(2)),
          maxSpeed: Number(maxSpeed.toFixed(2)),
          time: Math.round(t),
        });
      }, 1000);
    }, 300);

    return { connected: true };
  },

  async getServices() { return { servicesRequested: true }; },

  async addListener(eventName: any, listenerFunc: any) {
    on(eventName as keyof ListenerMap, listenerFunc);
  },
};

// iPhone/iPad use the real native plugin; web uses the stub.
const SoccerBluetooth =
  Capacitor.getPlatform() === 'web'
    ? WebStub
    : registerPlugin<BluetoothLePlugin>('SoccerBluetooth');

export default SoccerBluetooth;