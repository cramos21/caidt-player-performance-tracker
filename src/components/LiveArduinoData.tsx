import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBluetooth, SoccerTrackerData } from "@/hooks/useBluetooth";
import { Activity, Timer, Target, Zap, Bluetooth, BluetoothOff } from "lucide-react";

interface LiveArduinoDataProps {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  isSessionActive?: boolean;
}

const LiveArduinoData = ({ onSessionStart, onSessionEnd, isSessionActive = false }: LiveArduinoDataProps) => {
  const { isConnected, trackerData, disconnect, sendCommand } = useBluetooth();

  const handleStartSession = async () => {
    if (isConnected) {
      await sendCommand('START_SESSION');
      onSessionStart?.();
    }
  };

  const handleEndSession = async () => {
    if (isConnected) {
      await sendCommand('END_SESSION');
      onSessionEnd?.();
    }
  };

  const handleResetData = async () => {
    if (isConnected) {
      await sendCommand('RESET_DATA');
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <BluetoothOff className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No Tracker Connected</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Performance Soccer Tracker to see live performance data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-primary" />
              Arduino Nano Tracker
            </span>
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleStartSession}
              disabled={isSessionActive}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSessionActive ? 'Session Active' : 'Start Session'}
            </Button>
            <Button
              onClick={isSessionActive ? handleEndSession : handleResetData}
              variant="outline"
              className="w-full"
            >
              {isSessionActive ? 'End Session' : 'Reset Data'}
            </Button>
          </div>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            Disconnect Tracker
          </Button>
        </CardContent>
      </Card>

      {/* Live Performance Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Live Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Speed */}
            <div className="text-center p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Speed</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {trackerData.speed.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">km/h</div>
            </div>

            {/* Distance */}
            <div className="text-center p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Distance</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {trackerData.distance.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">km</div>
            </div>

            {/* Kicks */}
            <div className="text-center p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Kicks</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {trackerData.kicks}
              </div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>

            {/* Session Time */}
            <div className="text-center p-4 bg-muted/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Time</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {Math.floor(trackerData.sessionTime)}
              </div>
              <div className="text-xs text-muted-foreground">minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveArduinoData;