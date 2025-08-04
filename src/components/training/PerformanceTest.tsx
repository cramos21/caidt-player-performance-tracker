import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Timer } from "lucide-react";

interface PerformanceTestProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected: boolean;
}

const PerformanceTest = ({ onBack, onStartTraining, isConnected }: PerformanceTestProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Performance Test</h1>
        <p className="text-sm text-muted-foreground mt-2">Measure your capabilities and track improvement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Test Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">20-30 min</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold">Assessment</p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <h3 className="font-medium text-purple-400 mb-2">What we'll measure:</h3>
            <ul className="text-sm text-purple-300 space-y-1">
              <li>• Maximum sprint speed</li>
              <li>• Acceleration times</li>
              <li>• Agility and direction changes</li>
              <li>• Ball control under pressure</li>
            </ul>
          </div>

          <Button 
            className="w-full" 
            onClick={onStartTraining}
            disabled={!isConnected}
            size="lg"
          >
            <Timer className="w-4 h-4 mr-2" />
            {isConnected ? 'Start Performance Test' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTest;