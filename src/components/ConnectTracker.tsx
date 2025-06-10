
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Smartphone, Wifi, CheckCircle } from "lucide-react";

interface ConnectTrackerProps {
  onConnect: () => void;
}

const ConnectTracker = ({ onConnect }: ConnectTrackerProps) => {
  const handleConnect = () => {
    // Simulate connection process
    setTimeout(() => {
      onConnect();
    }, 2000);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Bluetooth className="w-6 h-6 text-blue-600" />
          Connect Your Soccer Tracker
        </CardTitle>
        <CardDescription>
          Connect your physical soccer boot tracker to start collecting real-time performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Bluetooth className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">Step 1</h4>
            <p className="text-sm text-gray-600">Turn on your tracker and enable Bluetooth</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Step 2</h4>
            <p className="text-sm text-gray-600">Make sure your phone's Bluetooth is enabled</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold">Step 3</h4>
            <p className="text-sm text-gray-600">Click connect and start tracking</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold mb-3">Compatible Trackers</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  ST
                </div>
                <div>
                  <div className="font-medium">SoccerTrack Pro</div>
                  <div className="text-xs text-gray-500">Model: ST-2024</div>
                </div>
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  KS
                </div>
                <div>
                  <div className="font-medium">KickSense Elite</div>
                  <div className="text-xs text-gray-500">Model: KS-Elite-2024</div>
                </div>
              </div>
              <Badge variant="outline">Compatible</Badge>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={handleConnect} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Bluetooth className="w-4 h-4 mr-2" />
            Connect Tracker
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Make sure your tracker is within 10 meters and powered on
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectTracker;
