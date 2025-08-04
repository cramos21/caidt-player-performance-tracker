import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Smartphone, CheckCircle, Search } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useState } from "react";
import { BleDevice, BleClient } from '@capacitor-community/bluetooth-le';
import { toast } from 'sonner';

interface ConnectTrackerProps {
  onConnect: () => void;
}

const ConnectTracker = ({ onConnect }: ConnectTrackerProps) => {
  const { isScanning, scanForDevices, connectToDevice, debugInfo } = useBluetooth();
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);

  const handleScan = async () => {
    try {
      console.log('Starting scan...');
      setScanInProgress(true);
      setAvailableDevices([]);
      setShowDevices(true); // Show device list immediately with loading state
      
      // Use the EXACT same logic as the debug scanner that works
      console.log('🔧 Initializing Bluetooth...');
      await BleClient.initialize();
      console.log('✅ BLE Client initialized');

      console.log('🔍 Starting BLE scan...');
      await BleClient.requestLEScan({
        allowDuplicates: false
      }, (result) => {
        console.log(`📱 Found: ${result.device.name || 'Unknown'} (${result.device.deviceId.slice(0, 12)}...)`);
        setAvailableDevices(prev => {
          const exists = prev.find(d => d.deviceId === result.device.deviceId);
          if (!exists) {
            return [...prev, result.device];
          }
          return prev;
        });
      });

      // Scan for 6 seconds (same as debug)
      console.log('⏳ Scanning for 6 seconds...');
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      console.log('🛑 Stopping scan and getting results...');
      const allDevices = await BleClient.getDevices([]);
      await BleClient.stopLEScan();
      
      console.log(`📋 Total devices found: ${allDevices.length}`);
      
      // Always show all devices found
      setAvailableDevices(allDevices);
      setScanInProgress(false);
      
      // Filter for soccer trackers for the toast message
      const trackers = allDevices.filter(device => {
        const name = device.name?.toLowerCase() || '';
        return name.includes('soccer') || 
               name.includes('tracker') || 
               (name.includes('player') && name.includes('performance')) ||
               name.includes('arduino');
      });
      
      if (trackers.length === 0) {
        toast.info(`Found ${allDevices.length} devices - look for your Arduino or tracker device.`);
      } else {
        toast.success(`Found ${trackers.length} potential soccer tracker(s) and ${allDevices.length - trackers.length} other devices!`);
      }
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('Scan failed: ' + error);
      setScanInProgress(false);
      setShowDevices(true);
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
                  // Determine device type and confidence - FIXED Arduino detection
                  const name = device.name || 'Unknown Device';
                  const isLikelySoccerTracker = name.toLowerCase().includes('soccer') || 
                                              name.toLowerCase().includes('player') ||
                                              name.toLowerCase().includes('performance') ||
                                              name.toLowerCase().includes('arduino') ||  // Key fix!
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