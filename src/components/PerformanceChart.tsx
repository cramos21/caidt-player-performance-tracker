
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PerformanceChart = () => {
  // Mock data for the last 7 days
  const weeklyData = [
    { day: "Mon", speed: 22.5, distance: 8.2, kicks: 45 },
    { day: "Tue", speed: 19.8, distance: 6.7, kicks: 38 },
    { day: "Wed", speed: 25.1, distance: 9.4, kicks: 52 },
    { day: "Thu", speed: 21.3, distance: 7.8, kicks: 41 },
    { day: "Fri", speed: 23.7, distance: 8.9, kicks: 48 },
    { day: "Sat", speed: 26.2, distance: 10.1, kicks: 56 },
    { day: "Sun", speed: 20.4, distance: 7.2, kicks: 39 }
  ];

  // Mock data for session progression
  const sessionData = [
    { minute: 0, speed: 0, heartRate: 80 },
    { minute: 5, speed: 15, heartRate: 120 },
    { minute: 10, speed: 22, heartRate: 145 },
    { minute: 15, speed: 28, heartRate: 165 },
    { minute: 20, speed: 25, heartRate: 155 },
    { minute: 25, speed: 30, heartRate: 170 },
    { minute: 30, speed: 27, heartRate: 160 },
    { minute: 35, speed: 24, heartRate: 150 },
    { minute: 40, speed: 18, heartRate: 135 },
    { minute: 45, speed: 12, heartRate: 110 }
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Track your progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground min-w-fit">
              <TabsTrigger value="weekly" className="whitespace-nowrap">Weekly Overview</TabsTrigger>
              <TabsTrigger value="session" className="whitespace-nowrap">Session Analysis</TabsTrigger>
              <TabsTrigger value="kicks" className="whitespace-nowrap">Kick Performance</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    name="Max Speed (km/h)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    name="Distance (km)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="minute" label={{ value: 'Minutes', position: 'insideBottom', offset: -10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    name="Speed (km/h)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="kicks" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="kicks" 
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Kicks"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
