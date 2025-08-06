import { useState, useCallback } from 'react';
import { BleClient, BleDevice, numbersToDataView, dataViewToNumbers } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

// Arduino Nano service and characteristic UUIDs (matching your Arduino code)
const SOCCER_TRACKER_SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const KICKS_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789001';
const DISTANCE_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789002';
const MAX_SPEED_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789003';
const TIME_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789004';

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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [trackerData, setTrackerData] = useState<SoccerTrackerData>({
    speed: 0,
    distance: 0,
    kicks: 0,
    sessionTime: 0
  });

  const initializeBluetooth = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        toast.error('Bluetooth scanning requires a native app build. Please build and install the native iOS app.');
        return false;
      }

      console.log('🔧 Step 1: Checking platform...');
      console.log('🔧 Step 2: Initializing BLE Client with explicit permissions...');

      if (Capacitor.getPlatform() === 'ios') {
        console.log('📱 iOS detected - requesting explicit permissions...');
        try {
          await BleClient.initialize({ androidNeverForLocation: false });
          console.log('✅ iOS BLE initialized with permissions');
        } catch (iosError) {
          console.error('❌ iOS BLE initialization failed:', iosError);
          throw iosError;
        }
      } else {
        await BleClient.initialize();
        console.log('✅ Android BLE initialized');
      }

      const isEnabled = await BleClient.isEnabled();
      console.log('📱 BLE enabled check:', isEnabled);

      if (!isEnabled) {
        toast.error('Bluetooth is not enabled on your device');
        return false;
      }

      console.log('✅ Bluetooth initialization complete and verified');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Bluetooth:', error);
      toast.error(`Failed to initialize Bluetooth: ${error.message}`);
      return false;
    }
  }, []);

  const scanForDevices = useCallback(async (): Promise<BleDevice[]> => {
    const addDebug = (msg: string) => {
      console.log(msg);
      setDebugInfo(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    addDebug('🔍 Starting Bluetooth scan...');
    try {
      setIsScanning(true);
      setDebugInfo([]);

      addDebug('🔧 Auto-initializing Bluetooth...');
      try {
        await BleClient.initialize();
        addDebug('✅ BLE Client initialized');
      } catch (initError) {
        addDebug(`⚠️ Init failed (might already be initialized): ${initError}`);
      }

      addDebug('🔍 Attempting direct BLE scan...');
      await BleClient.requestLEScan(
        { allowDuplicates: false },
        (result) => {
          const deviceInfo = `📱 Found: ${result.device.name || 'Unknown'} (${result.device.deviceId.slice(0, 8)}...)`;
          addDebug(deviceInfo);
        }
      );
      addDebug('✅ Direct scan started successfully');

      await new Promise(resolve => setTimeout(resolve, 6000));

      addDebug('🛑 Stopping scan and getting results...');
      const allDevices = await BleClient.getDevices([]);
      await BleClient.stopLEScan();

      addDebug(`📋 Total devices found: ${allDevices.length}`);
      allDevices.forEach((device, index) => {
        addDebug(`Device ${index + 1}: ${device.name || 'No Name'} - ID: ${device.deviceId.slice(-6)}`);
      });

      if (allDevices.length === 0) {
        addDebug('❌ No Bluetooth devices found');
        toast.error('No devices found. Make sure your Arduino is advertising.');
      } else {
        const trackers = allDevices.filter(device => {
          const name = device.name?.toLowerCase() || '';
          return name.includes('arduino') || name.includes('performance') || name.includes('player') || name.includes('tracker');
        });

        if (trackers.length > 0) {
          addDebug(`🎯 Found ${trackers.length} Performance Tracker(s)!`);
          toast.success(`Found ${trackers.length} Performance Tracker(s)!`);
        } else {
          toast.info(`Found ${allDevices.length} devices. Look for "Arduino" or "Player Performance Tracker".`);
        }
      }

      return allDevices;
    } catch (error) {
      addDebug(`❌ Scan failed: ${error}`);
      toast.error('Bluetooth scan failed: ' + error);
      return [];
    } finally {
      addDebug('🏁 Scan completed');
      setIsScanning(false);
    }
  }, []);

  const connectToDevice = useCallback(async (device: BleDevice) => {
    try {
      await BleClient.connect(device.deviceId, (deviceId) => {
        console.log(`Disconnected from device ${deviceId}`);
        setIsConnected(false);
        setConnectedDevice(null);
        toast.info('Device disconnected');
      });

      const services = await BleClient.getServices(device.deviceId);
      const hasTrackerService = services.some(service => service.uuid.toLowerCase() === SOCCER_TRACKER_SERVICE_UUID.toLowerCase());

      if (!hasTrackerService) {
        toast.error('Device does not have the required soccer tracker service');
        throw new Error('Missing tracker service');
      }

      setIsConnected(true);
      setConnectedDevice(device);
      toast.success('Connected to soccer tracker!');

      await startNotifications(device.deviceId);
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect to device');
    }
  }, []);

  const startNotifications = useCallback(async (deviceId: string) => {
    try {
      await BleClient.startNotifications(deviceId, SOCCER_TRACKER_SERVICE_UUID, KICKS_CHARACTERISTIC_UUID, (value) => {
        const kicks = dataViewToNumbers(value)[0];
        setTrackerData(prev => ({ ...prev, kicks: Math.round(kicks) }));
      });

      await BleClient.startNotifications(deviceId, SOCCER_TRACKER_SERVICE_UUID, DISTANCE_CHARACTERISTIC_UUID, (value) => {
        const distance = dataViewToNumbers(value)[0];
        setTrackerData(prev => ({ ...prev, distance: Math.round(distance * 100) / 100 }));
      });

      await BleClient.startNotifications(deviceId, SOCCER_TRACKER_SERVICE_UUID, MAX_SPEED_CHARACTERISTIC_UUID, (value) => {
        const speed = dataViewToNumbers(value)[0];
        setTrackerData(prev => ({ ...prev, speed: Math.round(speed * 100) / 100 }));
      });

      await BleClient.startNotifications(deviceId, SOCCER_TRACKER_SERVICE_UUID, TIME_CHARACTERISTIC_UUID, (value) => {
        const sessionTime = dataViewToNumbers(value)[0];
        setTrackerData(prev => ({ ...prev, sessionTime: Math.round(sessionTime) }));
      });
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
        setTrackerData({ speed: 0, distance: 0, kicks: 0, sessionTime: 0 });
        toast.info('Disconnected from tracker');
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error('Failed to disconnect');
    }
  }, [connectedDevice]);

  const sendCommand = useCallback(async (command: string) => {
    try {
      if (!connectedDevice) throw new Error('No device connected');
      const commandData = numbersToDataView([...new TextEncoder().encode(command)]);
      await BleClient.write(connectedDevice.deviceId, SOCCER_TRACKER_SERVICE_UUID, KICKS_CHARACTERISTIC_UUID, commandData);
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
    debugInfo,
    scanForDevices,
    connectToDevice,
    disconnect,
    sendCommand
  };
};