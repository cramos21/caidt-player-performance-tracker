import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Bluetooth, Play, BarChart3, Trophy, Smartphone, CheckCircle } from "lucide-react";

interface HelpScreenProps {
  onBack: () => void;
}

const HelpScreen = ({ onBack }: HelpScreenProps) => {
  const steps = [
    {
      icon: Bluetooth,
      title: "Connect Your Tracker",
      description: "Pair your soccer boot tracker via Bluetooth",
      details: [
        "Turn on your tracker device",
        "Enable Bluetooth on your phone", 
        "Tap 'Connect Tracker' in the app",
        "Select your device from the list"
      ]
    },
    {
      icon: Play,
      title: "Start Training Session",
      description: "Begin tracking your performance",
      details: [
        "Tap the 'Start Training' button",
        "Wait for the 3-2-1 countdown",
        "Start your training session",
        "The app will track automatically"
      ]
    },
    {
      icon: BarChart3,
      title: "View Live Stats",
      description: "Monitor your performance in real-time",
      details: [
        "See speed, distance, and kicks live",
        "Check your heart rate and pace",
        "Use pause/resume as needed",
        "End session when finished"
      ]
    },
    {
      icon: Trophy,
      title: "Track Your Progress",
      description: "Analyze stats and unlock achievements",
      details: [
        "Review session summaries",
        "Track weekly goals and streaks",
        "Unlock badges and rewards",
        "Compare with past performance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ScrollArea className="h-screen">
        <div className="px-4 py-6 max-w-sm mx-auto pb-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">How It Works</h1>
          </div>

          {/* Intro */}
          <div className="text-center mb-8 space-y-3">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Get Started in 4 Easy Steps</h2>
              <p className="text-sm text-muted-foreground">
                Follow these simple steps to start tracking your soccer performance
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-primary font-semibold">Step {index + 1}</div>
                      <div className="text-foreground">{step.title}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card className="mt-8 bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-foreground text-sm">Tracker not connecting?</div>
                  <div className="text-xs text-muted-foreground">Make sure Bluetooth is enabled and your tracker is within 10 meters</div>
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">Data seems inaccurate?</div>
                  <div className="text-xs text-muted-foreground">Ensure your tracker is properly calibrated and secured to your boot</div>
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">App running slow?</div>
                  <div className="text-xs text-muted-foreground">Close other apps and ensure you have a stable internet connection</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpScreen;