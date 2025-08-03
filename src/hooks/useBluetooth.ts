import { useState, useCallback } from 'react';
import { BleClient, BleDevice, numbersToDataView, dataViewToNumbers } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

// Arduino Nano service and characteristic UUIDs
const SOCCER_TRACKER_SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const KICKS_CHARACTERISTIC_UUID = '87654321-4321-4321-4321-cba987654321';
const DISTANCE_CHARACTERISTIC_UUID = '11111111-2222-3333-4444-555555555555';
const MAX_SPEED_CHARACTERISTIC_UUID = '66666666-7777-8888-9999-aaaaaaaaaaaa';
const TIME_CHARACTERISTIC_UUID = 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff';

export interface SoccerTrackerData {
  speed: number; // km/h
  distance: number; // km
  kicks: number;
  sessionTime: number; // minutes
}

export const useBluetooth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [trackerData, setTrackerData] = useState<SoccerTrackerData>({
    speed: 0,
    distance: 0,
    kicks: 0,
    sessionTime: 0
  });

  const initializeBluetooth = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        toast.error('Bluetooth is only available on mobile devices');
        return false;
      }

      await BleClient.initialize();
      return true;
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      toast.error('Failed to initialize Bluetooth');
      return false;
    }
  }, []);

  const scanForDevices = useCallback(async (): Promise<BleDevice[]> => {
    try {
      setIsScanning(true);
      const initialized = await initializeBluetooth();
      if (!initialized) return [];

      // Request permissions
      await BleClient.requestLEScan(
        {
          services: [SOCCER_TRACKER_SERVICE_UUID],
          allowDuplicates: false,
          scanMode: 1 // SCAN_MODE_LOW_LATENCY
        },
        (result) => {
          console.log('Device found:', result);
        }
      );

      // Scan for 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const devices = await BleClient.getDevices([SOCCER_TRACKER_SERVICE_UUID]);
      await BleClient.stopLEScan();
      
      return devices;
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('Failed to scan for devices');
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [initializeBluetooth]);

  const connectToDevice = useCallback(async (device: BleDevice) => {
    try {
      await BleClient.connect(device.deviceId, (deviceId) => {
        console.log(`Disconnected from device ${deviceId}`);
        setIsConnected(false);
        setConnectedDevice(null);
        toast.info('Device disconnected');
      });

      // Get services to verify connection
      const services = await BleClient.getServices(device.deviceId);
      const hasTrackerService = services.some(
        service => service.uuid === SOCCER_TRACKER_SERVICE_UUID
      );

      if (!hasTrackerService) {
        throw new Error('Device does not have the required soccer tracker service');
      }

      setIsConnected(true);
      setConnectedDevice(device);
      toast.success('Successfully connected to soccer tracker!');

      // Start notifications for data updates
      await startNotifications(device.deviceId);

    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect to device');
      throw error;
    }
  }, []);

  const startNotifications = useCallback(async (deviceId: string) => {
    try {
      // Start notifications for kicks
      await BleClient.startNotifications(
        deviceId,
        SOCCER_TRACKER_SERVICE_UUID,
        KICKS_CHARACTERISTIC_UUID,
        (value) => {
          const kicks = dataViewToNumbers(value)[0];
          setTrackerData(prev => ({ ...prev, kicks: Math.round(kicks) }));
        }
      );

      // Start notifications for distance
      await BleClient.startNotifications(
        deviceId,
        SOCCER_TRACKER_SERVICE_UUID,
        DISTANCE_CHARACTERISTIC_UUID,
        (value) => {
          const distance = dataViewToNumbers(value)[0];
          setTrackerData(prev => ({ ...prev, distance: Math.round(distance * 100) / 100 }));
        }
      );

      // Start notifications for max speed
      await BleClient.startNotifications(
        deviceId,
        SOCCER_TRACKER_SERVICE_UUID,
        MAX_SPEED_CHARACTERISTIC_UUID,
        (value) => {
          const speed = dataViewToNumbers(value)[0];
          setTrackerData(prev => ({ ...prev, speed: Math.round(speed * 100) / 100 }));
        }
      );

      // Start notifications for session time
      await BleClient.startNotifications(
        deviceId,
        SOCCER_TRACKER_SERVICE_UUID,
        TIME_CHARACTERISTIC_UUID,
        (value) => {
          const sessionTime = dataViewToNumbers(value)[0];
          setTrackerData(prev => ({ ...prev, sessionTime: Math.round(sessionTime) }));
        }
      );
    } catch (error) {
      console.error('Failed to start notifications:', error);
      toast.error('Failed to receive data from tracker');
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (connectedDevice) {
        await BleClient.disconnect(connectedDevice.deviceId);
        setIsConnected(false);
        setConnectedDevice(null);
        setTrackerData({
          speed: 0,
          distance: 0,
          kicks: 0,
          sessionTime: 0
        });
        toast.info('Disconnected from tracker');
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error('Failed to disconnect');
    }
  }, [connectedDevice]);

  const sendCommand = useCallback(async (command: string) => {
    try {
      if (!connectedDevice) {
        throw new Error('No device connected');
      }

      const commandData = numbersToDataView([...new TextEncoder().encode(command)]);
      
      await BleClient.write(
        connectedDevice.deviceId,
        SOCCER_TRACKER_SERVICE_UUID,
        KICKS_CHARACTERISTIC_UUID,
        commandData
      );
    } catch (error) {
      console.error('Failed to send command:', error);
      toast.error('Failed to send command to tracker');
    }
  }, [connectedDevice]);

  return {
    isConnected,
    isScanning,
    connectedDevice,
    trackerData,
    scanForDevices,
    connectToDevice,
    disconnect,
    sendCommand
  };
};