import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, Activity, Target, User, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Soccer Performance Tracker</h1>
              <p className="text-muted-foreground">Connect your tracker to start monitoring your performance</p>
            </div>
            
            <Card className="border-2 border-dashed border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                  <Bluetooth className="w-6 h-6 text-primary" />
                  Connect Your Soccer Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg font-bold bg-primary hover:bg-primary/90">
                  <Bluetooth className="w-4 h-4 mr-2" />
                  Scan for Tracker
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Make sure your Performance Soccer Tracker is within 10 meters and powered on
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-sm text-muted-foreground">Kicks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">0 km/h</div>
                  <div className="text-sm text-muted-foreground">Max Speed</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-muted-foreground">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: "dashboard", icon: Activity, label: "Dashboard" },
            { id: "training", icon: Target, label: "Training" },
            { id: "performance", icon: TrendingUp, label: "Performance" },
            { id: "goals", icon: Target, label: "Goals" },
            { id: "account", icon: User, label: "Account" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-1 transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
