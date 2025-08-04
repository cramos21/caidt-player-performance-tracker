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
  const [debugInfo, setDebugInfo] = useState<string[]>([]); // Add debug info state
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
    const addDebug = (msg: string) => {
      console.log(msg);
      setDebugInfo(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };
    
    addDebug('🔍 Starting Bluetooth scan...');
    try {
      setIsScanning(true);
      setDebugInfo([]); // Clear previous debug info
      
      addDebug('📱 Checking platform and initializing...');
      const initialized = await initializeBluetooth();
      if (!initialized) {
        addDebug('❌ Bluetooth initialization failed');
        return [];
      }

      addDebug('✅ Bluetooth initialized, starting scan...');
      
      // Check if we have location permissions
      try {
        await BleClient.requestLEScan(
          {
            allowDuplicates: false,
            scanMode: 1 // SCAN_MODE_LOW_LATENCY
          },
          (result) => {
            const deviceInfo = `📱 Found: ${result.device.name || 'Unknown'} (${result.device.deviceId.slice(0, 8)}...)`;
            addDebug(deviceInfo);
          }
        );
        addDebug('✅ Scan started successfully');
      } catch (scanError) {
        addDebug(`❌ Failed to start scan: ${scanError}`);
        toast.error('Failed to start Bluetooth scan. Check permissions.');
        return [];
      }

      // Scan for 10 seconds
      addDebug('⏳ Scanning for 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      addDebug('🛑 Stopping scan and getting results...');
      
      // Get all discovered devices
      const allDevices = await BleClient.getDevices([]);
      await BleClient.stopLEScan();
      
      addDebug(`📋 Total devices found: ${allDevices.length}`);
      allDevices.forEach((device, index) => {
        addDebug(`Device ${index + 1}: ${device.name || 'Unknown'}`);
      });
      
      // For debugging: return ALL devices, not just filtered ones
      if (allDevices.length === 0) {
        addDebug('❌ No Bluetooth devices found at all');
        toast.error('No Bluetooth devices found. Make sure Bluetooth is enabled.');
      } else {
        addDebug(`✅ Found ${allDevices.length} total Bluetooth devices`);
        toast.success(`Found ${allDevices.length} Bluetooth devices. Look for your Arduino in the list.`);
      }
      
      return allDevices; // Return ALL devices for debugging
    } catch (error) {
      addDebug(`❌ Scan failed: ${error}`);
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
    debugInfo,
    scanForDevices,
    connectToDevice,
    disconnect,
    sendCommand
  };
};