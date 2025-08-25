import { registerPlugin } from '@capacitor/core';

export interface SoccerBluetoothPlugin {
  initialize(): Promise<{ initialized: boolean }>;
  requestLEScan(): Promise<{ status: string }>;
  stopLEScan(): Promise<{ status: string }>;
  connect(options: { deviceId: string }): Promise<{ connected: boolean }>;
  getServices(): Promise<{ servicesRequested: boolean }>;
}

const SoccerBluetooth = registerPlugin<SoccerBluetoothPlugin>('SoccerBluetoothPlugin');

export default SoccerBluetooth;