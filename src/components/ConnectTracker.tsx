import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Smartphone, CheckCircle, Search } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useState } from "react";
import { BleDevice, BleClient } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

interface ConnectTrackerProps {
  onConnect: () => void;
}

const ConnectTracker = ({ onConnect }: ConnectTrackerProps) => {
  const { isScanning, scanForDevices, connectToDevice, debugInfo } = useBluetooth();
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);

  // Test if BLE is available at all
  const testBLE = async () => {
    try {
      console.log('🧪 === DETAILED BLE TEST ===');
      console.log('Platform:', Capacitor.getPlatform());
      console.log('Is native platform:', Capacitor.isNativePlatform());
      
      // Test 1: Basic initialization
      console.log('🔧 Test 1: Initialize BLE...');
      await BleClient.initialize();
      console.log('✅ BLE Initialize successful');
      
      // Test 2: Check if enabled
      console.log('🔧 Test 2: Check if BLE enabled...');
      const isEnabled = await BleClient.isEnabled();
      console.log('📱 Bluetooth enabled:', isEnabled);
      
      // Test 3: Check location
      console.log('🔧 Test 3: Check location enabled...');
      const isLocationEnabled = await BleClient.isLocationEnabled();
      console.log('📍 Location enabled:', isLocationEnabled);
      
      console.log('🧪 === ALL TESTS PASSED ===');
      toast.success(`BLE: ${isEnabled}, Location: ${isLocationEnabled}`);
      
    } catch (error) {
      console.error('❌ === BLE TEST FAILED ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      
      toast.error(`BLE test failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleScan = async () => {
    try {
      console.log('🚀 === STARTING BLUETOOTH SCAN DEBUG ===');
      console.log('Platform:', navigator.userAgent);
      console.log('Bluetooth available:', 'bluetooth' in navigator);
      
      setScanInProgress(true);
      setAvailableDevices([]);
      setShowDevices(true);
      
      // Test if BLE is available at all
      console.log('🔧 Testing BLE availability...');
      try {
        await BleClient.initialize();
        console.log('✅ BLE Client initialized successfully');
      } catch (initError) {
        console.error('❌ BLE initialization failed:', initError);
        throw new Error(`BLE initialization failed: ${initError.message}`);
      }

      // Check if we can even start a scan
      console.log('🔍 Attempting to start scan...');
      let deviceCount = 0;
      
      try {
        await BleClient.requestLEScan(
          {}, // Absolutely minimal options
          (result) => {
            deviceCount++;
            console.log(`📱 DEVICE ${deviceCount}: "${result.device.name || 'UNNAMED'}" - ID: ${result.device.deviceId}`);
            console.log('   Full device object:', result.device);
            
            setAvailableDevices(prev => {
              const exists = prev.find(d => d.deviceId === result.device.deviceId);
              if (!exists) {
                console.log(`   ➕ Adding to list`);
                return [...prev, result.device];
              } else {
                console.log(`   🔄 Already in list`);
                return prev;
              }
            });
          }
        );
        console.log('✅ Scan started successfully, waiting...');
      } catch (scanError) {
        console.error('❌ requestLEScan failed:', scanError);
        throw new Error(`Scan start failed: ${scanError.message}`);
      }

      // Wait for scan
      console.log('⏳ Scanning for 6 seconds...');
      for (let i = 1; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`   ⏱️ ${i}/6 seconds... devices found so far: ${deviceCount}`);
      }
      
      // Stop scan
      console.log('🛑 Stopping scan...');
      try {
        await BleClient.stopLEScan();
        console.log('✅ Scan stopped');
      } catch (stopError) {
        console.error('⚠️ Error stopping scan:', stopError);
      }
      
      // Get final device list
      console.log('📋 Getting final device list...');
      try {
        const finalDevices = await BleClient.getDevices([]);
        console.log(`📱 Final device count: ${finalDevices.length}`);
        finalDevices.forEach((device, i) => {
          console.log(`   ${i+1}. "${device.name || 'UNNAMED'}" - ${device.deviceId}`);
        });
        
        setAvailableDevices(finalDevices);
        setScanInProgress(false);
        
        if (finalDevices.length === 0) {
          console.log('❌ NO DEVICES FOUND');
          toast.error('No Bluetooth devices found. Check if Bluetooth is enabled and permissions are granted.');
        } else {
          console.log(`✅ SUCCESS: Found ${finalDevices.length} devices`);
          toast.success(`Found ${finalDevices.length} Bluetooth devices!`);
        }
      } catch (getDevicesError) {
        console.error('❌ getDevices failed:', getDevicesError);
        setScanInProgress(false);
        toast.error(`Failed to get device list: ${getDevicesError.message}`);
      }
      
      console.log('🏁 === SCAN DEBUG COMPLETE ===');
      
    } catch (error) {
      console.error('❌ === SCAN COMPLETELY FAILED ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      
      setScanInProgress(false);
      toast.error(`Bluetooth scan failed: ${error.message}. Try restarting the app.`);
    }
  };

  const handleDeviceConnect = async (device: BleDevice) => {
    try {
      console.log(`🔗 Connecting to: ${device.name || 'Unknown'}`);
      
      // Connect and stay connected (same as debug page)
      await BleClient.connect(device.deviceId, (deviceId) => {
        console.log(`🔌 Device ${deviceId.slice(-8)} disconnected`);
        onConnect(); // Notify parent that we're disconnected
      });
      
      console.log('✅ Connected successfully');
      
      // Verify it has the correct service
      const services = await BleClient.getServices(device.deviceId);
      const expectedService = '12345678-1234-1234-1234-123456789abc';
      const hasExpectedService = services.some(s => 
        s.uuid.toLowerCase() === expectedService.toLowerCase()
      );
      
      if (hasExpectedService) {
        console.log('🎯 Soccer tracker service found!');
        toast.success('Arduino connected successfully!');
        onConnect(); // Notify parent that we're connected
      } else {
        console.log('⚠️ Wrong device type - disconnecting');
        await BleClient.disconnect(device.deviceId);
        toast.error('Device connected but missing soccer tracker service');
      }
      
    } catch (error) {
      console.error('❌ Connection failed:', error);
      toast.error('Failed to connect: ' + error);
    }
  };

  return (
    <Card className="border-2 border-dashed border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Bluetooth className="w-6 h-6 text-primary" />
          Connect Your Soccer Tracker
        </CardTitle>
        <CardDescription className="text-sm">
          Connect your physical soccer tracker to start collecting real-time performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Bluetooth className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Step 1</h4>
            <p className="text-sm text-muted-foreground">Turn on your tracker and enable Bluetooth</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Step 2</h4>
            <p className="text-sm text-muted-foreground">Make sure your phone's Bluetooth is enabled</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground">Step 3</h4>
            <p className="text-sm text-muted-foreground">Tap "Scan for Tracker" to find your device</p>
          </div>
        </div>

        {!showDevices ? (
          <div className="text-center space-y-3">
            <div className="space-y-3">
              <Button 
                onClick={handleScan} 
                size="lg" 
                disabled={isScanning || scanInProgress}
                className="w-full sm:w-auto h-14 text-lg font-bold bg-primary hover:bg-primary/90 touch-target px-8"
              >
                {scanInProgress ? (
                  <>
                    <Search className="w-4 h-4 mr-0.5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-0.5" />
                    Scan for Tracker
                  </>
                )}
              </Button>
              
              <Button 
                onClick={testBLE}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Test BLE Status
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Make sure your Arduino soccer tracker is within 10 meters and powered on
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Available Devices</h4>
              <p className="text-sm text-muted-foreground">Look for devices marked as "Recommended" - these are likely your soccer tracker</p>
            </div>
            
            {scanInProgress ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-foreground font-medium">Scanning for devices...</p>
                <p className="text-xs text-muted-foreground">Looking for your Arduino soccer tracker</p>
              </div>
            ) : availableDevices.length > 0 ? (
              <div className="space-y-3">
                {availableDevices.map((device) => {
                  // Show ALL devices with minimal filtering - just highlight likely ones
                  const name = device.name || 'Unknown Device';
                  const isLikelySoccerTracker = name.toLowerCase().includes('arduino') ||
                                              name.toLowerCase().includes('soccer') || 
                                              name.toLowerCase().includes('tracker');
                  
                  return (
                    <div key={device.deviceId} className={`flex items-center justify-between p-4 border rounded-lg ${
                      isLikelySoccerTracker ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          isLikelySoccerTracker ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isLikelySoccerTracker ? '⚽' : 'BT'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {name}
                            {isLikelySoccerTracker && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Device ID: {device.deviceId.slice(-8)}</div>
                            <div className="text-xs">
                              {isLikelySoccerTracker ? '✅ Likely soccer tracker' : '⚠️ Generic Bluetooth device'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleDeviceConnect(device)}
                          size="sm"
                          variant={isLikelySoccerTracker ? "default" : "outline"}
                          className={isLikelySoccerTracker ? "bg-primary hover:bg-primary/90" : ""}
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div className="text-center pt-4 border-t border-border space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleScan}
                    disabled={scanInProgress}
                  >
                    {scanInProgress ? 'Scanning...' : 'Scan Again'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDevices(false)}
                  >
                    Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-muted-foreground">No devices found</p>
                <p className="text-xs text-muted-foreground">Make sure your Arduino soccer tracker is powered on and nearby</p>
                <Button
                  variant="outline"
                  onClick={handleScan}
                  disabled={scanInProgress}
                >
                  {scanInProgress ? 'Scanning...' : 'Scan Again'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Debug Information */}
        {debugInfo.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Debug Information:</h5>
            <div className="text-xs text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="font-mono">{info}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectTracker;