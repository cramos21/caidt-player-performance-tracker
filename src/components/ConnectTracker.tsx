import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";

type ConnectTrackerProps = {
  /** Optional callback. If not provided, we call connectQuick() from the BLE hook. */
  onConnect?: () => void;
};

const ConnectTracker: React.FC<ConnectTrackerProps> = ({ onConnect }) => {
  const { isConnected, isScanning, connectQuick } = useBluetooth();

  const handleConnect = async () => {
    if (onConnect) return onConnect();
    try {
      await connectQuick();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-primary" />
          Connect your tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Turn on your Soccer Tracker and tap connect.
        </p>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleConnect}
          disabled={isConnected || isScanning}
        >
          {isConnected ? "Connected" : isScanning ? "Scanning…" : "Connect to Tracker"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectTracker;