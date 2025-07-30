import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Bluetooth, ArrowRight } from "lucide-react";

interface PairingConfirmationProps {
  trackerName?: string;
  onGoToDashboard: () => void;
}

const PairingConfirmation = ({ trackerName = "SoccerTrack Pro", onGoToDashboard }: PairingConfirmationProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* Success Icon */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Connected!</h1>
            <p className="text-muted-foreground">
              Your tracker is successfully paired and ready to use
            </p>
          </div>
        </div>

        {/* Connection Details */}
        <Card className="bg-card/80 backdrop-blur-sm border-green-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-500 flex items-center justify-center gap-2">
              <Bluetooth className="w-5 h-5" />
              Device Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="font-semibold text-foreground">{trackerName}</div>
              <div className="text-sm text-muted-foreground">Model: ST-2024</div>
              <div className="text-xs text-green-400 mt-2">Signal: Strong</div>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div>✓ Bluetooth connection established</div>
              <div>✓ Device calibrated and ready</div>
              <div>✓ Real-time data streaming active</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="space-y-4">
          <Button 
            onClick={onGoToDashboard}
            size="lg" 
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Your tracker will remain connected while the app is open
          </p>
        </div>
      </div>
    </div>
  );
};

export default PairingConfirmation;