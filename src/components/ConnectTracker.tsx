
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Smartphone, Wifi, CheckCircle, Search } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useState } from "react";
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from 'sonner';

interface ConnectTrackerProps {
  onConnect: () => void;
}

const ConnectTracker = ({ onConnect }: ConnectTrackerProps) => {
  const { isScanning, scanForDevices, connectToDevice, debugInfo } = useBluetooth();
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);
  const [showDevices, setShowDevices] = useState(false);

  const handleScan = async () => {
    try {
      const devices = await scanForDevices();
      setAvailableDevices(devices);
      setShowDevices(true);
      
      if (devices.length === 0) {
        toast.error('No soccer trackers found. Make sure your device is on and nearby.');
      }
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  const handleDeviceConnect = async (device: BleDevice) => {
    try {
      await connectToDevice(device);
      onConnect(); // Call the parent callback on successful connection
    } catch (error) {
      console.error('Connection failed:', error);
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
            <p className="text-sm text-muted-foreground">Click connect and start tracking</p>
          </div>
        </div>


        {!showDevices ? (
          <div className="text-center space-y-3">
            <Button 
              onClick={handleScan} 
              size="lg" 
              disabled={isScanning}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 touch-target px-8"
            >
              {isScanning ? (
                <>
                  <Search className="w-4 h-4 mr-1 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4 mr-1" />
                  Scan for Tracker
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Make sure your Performance Soccer Tracker is within 10 meters and powered on
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Available Soccer Trackers</h4>
              <p className="text-sm text-muted-foreground">Select your Arduino Nano tracker to connect</p>
            </div>
            
            {availableDevices.length > 0 ? (
              <div className="space-y-3">
                {availableDevices.map((device) => (
                  <div key={device.deviceId} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                        ST
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{device.name || 'Soccer Tracker'}</div>
                        <div className="text-xs text-muted-foreground">Arduino Nano • ID: {device.deviceId.slice(-6)}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeviceConnect(device)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No devices found</p>
                <Button
                  variant="outline"
                  onClick={handleScan}
                  className="mt-2"
                  disabled={isScanning}
                >
                  Scan Again
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowDevices(false)}
                className="w-full sm:w-auto"
              >
                Back to Instructions
              </Button>
            </div>
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
