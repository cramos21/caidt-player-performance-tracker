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
        toast.error('Bluetooth scanning requires a native app build. Please build and install the native iOS app.');
        return false;
      }

      console.log('🔧 Step 1: Checking platform...');
      console.log('🔧 Step 2: Initializing BLE Client with explicit permissions...');
      
      // For iOS, request permissions explicitly first
      if (Capacitor.getPlatform() === 'ios') {
        console.log('📱 iOS detected - requesting explicit permissions...');
        try {
          // Request permissions first
          await BleClient.initialize({
            androidNeverForLocation: false
          });
          console.log('✅ iOS BLE initialized with permissions');
        } catch (iosError) {
          console.error('❌ iOS BLE initialization failed:', iosError);
          throw iosError;
        }
      } else {
        // Android initialization
        await BleClient.initialize();
        console.log('✅ Android BLE initialized');
      }
      
      // Test if BLE is actually working
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
      setDebugInfo([]); // Clear previous debug info
      
      // Auto-initialize if not already done
      addDebug('🔧 Auto-initializing Bluetooth...');
      try {
        await BleClient.initialize();
        addDebug('✅ BLE Client initialized');
      } catch (initError) {
        addDebug(`⚠️ Init failed (might already be initialized): ${initError}`);
      }
      
      // Skip the problematic initialization and go straight to scanning
      try {
        addDebug('🔍 Attempting direct BLE scan...');
        await BleClient.requestLEScan(
          {
            allowDuplicates: false
          },
          (result) => {
            const deviceInfo = `📱 Found: ${result.device.name || 'Unknown'} (${result.device.deviceId.slice(0, 8)}...)`;
            addDebug(deviceInfo);
          }
        );
        addDebug('✅ Direct scan started successfully');
      } catch (scanError) {
        addDebug(`❌ Direct scan failed: ${scanError}`);
        
        // Try without any options
        addDebug('🔄 Trying minimal scan...');
        try {
          await BleClient.requestLEScan({}, (result) => {
            addDebug(`📱 Minimal scan found: ${result.device.name || 'Unknown'}`);
          });
          addDebug('✅ Minimal scan started');
        } catch (minimalError) {
          addDebug(`❌ All scan methods failed: ${minimalError}`);
          toast.error('Cannot start Bluetooth scan. Please restart the app.');
          return [];
        }
      }

      // Scan for 6 seconds
      addDebug('⏳ Scanning for 6 seconds...');
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      addDebug('🛑 Stopping scan and getting results...');
      
      // Get all discovered devices
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
        addDebug(`✅ Found ${allDevices.length} devices`);
        const trackers = allDevices.filter(device => {
          // Look for Arduino devices or devices with "Performance" or "Player" in the name
          const name = device.name?.toLowerCase() || '';
          const hasTrackerName = name.includes('arduino') || 
                                 name.includes('performance') || 
                                 name.includes('player') ||
                                 name.includes('tracker');
          
          if (hasTrackerName) {
            addDebug(`🎯 Found potential tracker: ${device.name} (${device.deviceId.slice(-6)})`);
          }
          
          return hasTrackerName;
        });
        
        if (trackers.length > 0) {
          addDebug(`🎯 Found ${trackers.length} Performance Tracker(s)!`);
          toast.success(`Found ${trackers.length} Performance Tracker(s)!`);
        } else {
          addDebug(`ℹ️ No trackers found. Looking for devices with: Arduino, Performance, Player, or Tracker in name`);
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

      // Get services to verify connection
      const services = await BleClient.getServices(device.deviceId);
      console.log('Available services:', services.map(s => s.uuid));
      
      const hasTrackerService = services.some(
        service => service.uuid.toLowerCase() === SOCCER_TRACKER_SERVICE_UUID.toLowerCase()
      );

      if (!hasTrackerService) {
        console.log('Expected service UUID:', SOCCER_TRACKER_SERVICE_UUID);
        console.log('Available service UUIDs:', services.map(s => s.uuid));
        toast.error(`Device does not have the required soccer tracker service. Found services: ${services.map(s => s.uuid).join(', ')}`);
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