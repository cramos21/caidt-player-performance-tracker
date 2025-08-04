import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { 
  Bug, 
  Bluetooth, 
  Wifi, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Activity,
  Info
} from "lucide-react";

const BluetoothDebugger = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [systemInfo, setSystemInfo] = useState({
    platform: '',
    isNative: false,
    bluetoothEnabled: false,
    permissionsGranted: false
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev.slice(-20), logMessage]);
  };

  const checkSystemCapabilities = async () => {
    addLog('🔍 Checking system capabilities...');
    
    try {
      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();
      
      setSystemInfo(prev => ({
        ...prev,
        platform,
        isNative
      }));

      addLog(`Platform: ${platform} (Native: ${isNative})`);

      if (!isNative) {
        addLog('❌ Web platform detected - Bluetooth requires native build');
        toast.error('Bluetooth scanning requires a native app build');
        return false;
      }

      // Step 1: Initialize BLE
      addLog('🔧 Initializing Bluetooth...');
      try {
        await BleClient.initialize();
        addLog('✅ BLE Client initialized');
        setSystemInfo(prev => ({ ...prev, bluetoothEnabled: true }));
      } catch (error) {
        addLog(`❌ BLE initialization failed: ${error}`);
        setSystemInfo(prev => ({ ...prev, bluetoothEnabled: false }));
        toast.error('Failed to initialize Bluetooth');
        return false;
      }

      // Step 2: Request permissions explicitly
      addLog('🔧 Requesting Bluetooth permissions...');
      try {
        // First check if we already have permissions
        addLog('Checking current permission status...');
        
        // Try to enable notifications to trigger permission request
        addLog('Triggering permission dialog...');
        
        // This should trigger the iOS permission dialog
        await BleClient.requestLEScan({
          allowDuplicates: false
        }, (result) => {
          addLog(`Permission scan detected: ${result.device.name || 'Unknown'}`);
        });
        
        // Wait a moment for permission dialog
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Stop the permission scan
        await BleClient.stopLEScan();
        
        addLog('✅ Permission request completed');
        addLog('📱 Check your iPhone for permission dialogs');
        addLog('⚠️ You may need to restart the app after granting permissions');
        
        setSystemInfo(prev => ({ ...prev, permissionsGranted: true }));
        
        toast.info('Permission requested! Check iPhone Settings if no dialog appeared.');
        
      } catch (error) {
        addLog(`⚠️ Permission request process: ${error}`);
        addLog('📱 Go to iPhone Settings → Privacy → Bluetooth to manually enable');
        addLog('📱 Also enable Location Services for this app');
        setSystemInfo(prev => ({ ...prev, permissionsGranted: false }));
      }

      return true;
    } catch (error) {
      addLog(`❌ System check failed: ${error}`);
      return false;
    }
  };

  const performAdvancedScan = async () => {
    addLog('🔍 Starting advanced Bluetooth scan...');
    setIsScanning(true);
    setDevices([]);

    try {
      // Method 1: Scan for all devices
      addLog('Method 1: Scanning for all BLE devices...');
      await BleClient.requestLEScan(
        { allowDuplicates: false },
        (result) => {
          addLog(`📱 Found: ${result.device.name || 'Unknown'} (${result.device.deviceId.slice(0, 12)}...)`);
          setDevices(prev => {
            const exists = prev.find(d => d.deviceId === result.device.deviceId);
            if (!exists) {
              return [...prev, result.device];
            }
            return prev;
          });
        }
      );

      await new Promise(resolve => setTimeout(resolve, 8000));
      await BleClient.stopLEScan();
      
      const allDevices = await BleClient.getDevices([]);
      addLog(`📋 Total unique devices found: ${allDevices.length}`);
      
      // Method 2: Try scanning with service filter
      addLog('Method 2: Scanning for specific service...');
      const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
      
      try {
        await BleClient.requestLEScan(
          { 
            services: [SERVICE_UUID],
            allowDuplicates: false 
          },
          (result) => {
            addLog(`🎯 Service match: ${result.device.name || 'Unknown'}`);
          }
        );
        await new Promise(resolve => setTimeout(resolve, 5000));
        await BleClient.stopLEScan();
      } catch (serviceError) {
        addLog(`⚠️ Service-specific scan failed: ${serviceError}`);
      }

      // Method 3: Generic device discovery
      addLog('Method 3: Generic device discovery...');
      try {
        const genericDevices = await BleClient.getDevices([]);
        addLog(`📱 Generic discovery found: ${genericDevices.length} devices`);
        
        genericDevices.forEach((device, index) => {
          addLog(`Device ${index + 1}: ${device.name || 'No Name'} - ${device.deviceId.slice(-8)}`);
        });
      } catch (genericError) {
        addLog(`❌ Generic discovery failed: ${genericError}`);
      }

      setDevices(allDevices);
      addLog(`✅ Scan completed - ${allDevices.length} devices discovered`);

      // Log ALL device names for debugging
      allDevices.forEach((device, index) => {
        addLog(`Device ${index + 1}: "${device.name || 'No Name'}" - ID: ${device.deviceId.slice(-8)}`);
      });

    } catch (error) {
      addLog(`❌ Advanced scan failed: ${error}`);
    } finally {
      setIsScanning(false);
    }
  };

  const testDeviceConnection = async (device: BleDevice) => {
    addLog(`🔗 Testing connection to: ${device.name || 'Unknown'} (${device.deviceId.slice(-8)})`);
    
    try {
      await BleClient.connect(device.deviceId, (deviceId) => {
        addLog(`🔌 Device ${deviceId.slice(-8)} disconnected`);
      });
      addLog('✅ Connected successfully');

      // Get services
      const services = await BleClient.getServices(device.deviceId);
      addLog(`📋 Found ${services.length} services:`);
      
      services.forEach((service, index) => {
        addLog(`  Service ${index + 1}: ${service.uuid}`);
        service.characteristics?.forEach((char, charIndex) => {
          addLog(`    Characteristic ${charIndex + 1}: ${char.uuid}`);
        });
      });

      // Check for our specific service
      const expectedService = '12345678-1234-1234-1234-123456789abc';
      const hasExpectedService = services.some(s => 
        s.uuid.toLowerCase() === expectedService.toLowerCase()
      );
      
      if (hasExpectedService) {
        addLog('🎯 Expected soccer tracker service found!');
        addLog('🔗 Staying connected to tracker...');
        toast.success('Arduino connected! Go to Dashboard to start tracking.');
        
        // DON'T disconnect - stay connected!
        // Notify the app that we're connected and ready
        window.dispatchEvent(new CustomEvent('tracker-connected', { 
          detail: { 
            device, 
            deviceId: device.deviceId,
            isConnected: true
          }
        }));
        
      } else {
        addLog('⚠️ Expected service not found');
        addLog(`Expected: ${expectedService}`);
        addLog(`Available: ${services.map(s => s.uuid).join(', ')}`);
        
        // Only disconnect if it's NOT the right device
        await BleClient.disconnect(device.deviceId);
        addLog('🔌 Disconnected from non-tracker device');
      }

    } catch (error) {
      addLog(`❌ Connection test failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs cleared');
  };

  useEffect(() => {
    addLog('🚀 Bluetooth Debugger initialized');
    checkSystemCapabilities();
  }, []);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Bluetooth Debugger</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <Bug className="w-3 h-3" />
          Debug Mode
        </Badge>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Platform:</span>
              <Badge variant="outline">{systemInfo.platform}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Native:</span>
              {systemInfo.isNative ? 
                <CheckCircle className="w-4 h-4 text-green-500" /> : 
                <XCircle className="w-4 h-4 text-red-500" />
              }
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bluetooth:</span>
              {systemInfo.bluetoothEnabled ? 
                <CheckCircle className="w-4 h-4 text-green-500" /> : 
                <XCircle className="w-4 h-4 text-red-500" />
              }
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Permissions:</span>
              {systemInfo.permissionsGranted ? 
                <CheckCircle className="w-4 h-4 text-green-500" /> : 
                <XCircle className="w-4 h-4 text-red-500" />
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Debug Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={checkSystemCapabilities}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check System
            </Button>
            <Button 
              onClick={performAdvancedScan}
              disabled={isScanning}
              size="sm"
            >
              <Bluetooth className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Advanced Scan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discovered Devices */}
      {devices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Discovered Devices ({devices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((device) => (
              <div key={device.deviceId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{device.name || 'Unknown Device'}</div>
                  <div className="text-xs text-muted-foreground">ID: {device.deviceId.slice(-12)}</div>
                </div>
                <Button
                  onClick={() => testDeviceConnection(device)}
                  size="sm"
                  variant="outline"
                >
                  Test
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Debug Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Debug Logs
          </CardTitle>
          <Button onClick={clearLogs} variant="outline" size="sm">
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-3 rounded-lg h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No logs yet...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-foreground">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Debugging Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-700 space-y-2">
          <p>1. Make sure you're running this on a physical device (iOS/Android)</p>
          <p>2. Enable Bluetooth on your device</p>
          <p>3. Grant location permissions (required for BLE scanning)</p>
          <p>4. Your Arduino should advertise with name containing "Performance" or "Soccer"</p>
          <p>5. Arduino should use service UUID: 12345678-1234-1234-1234-123456789abc</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BluetoothDebugger;