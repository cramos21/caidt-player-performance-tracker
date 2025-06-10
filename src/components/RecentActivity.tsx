
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, TrendingUp, Award, Target } from "lucide-react";

const RecentActivity = () => {
  const recentSessions = [
    {
      id: 1,
      date: "Today, 2:30 PM",
      duration: "45 min",
      maxSpeed: "28.5 km/h",
      distance: "8.7 km",
      kicks: 52,
      location: "Training Ground A",
      performance: "excellent",
      highlights: ["New speed record", "Most kicks in session"]
    },
    {
      id: 2,
      date: "Yesterday, 4:15 PM",
      duration: "38 min",
      maxSpeed: "26.1 km/h",
      distance: "7.2 km",
      kicks: 41,
      location: "Local Park Field",
      performance: "good",
      highlights: ["Consistent pace"]
    },
    {
      id: 3,
      date: "2 days ago, 10:00 AM",
      duration: "52 min",
      maxSpeed: "24.8 km/h",
      distance: "9.1 km",
      kicks: 48,
      location: "Training Ground B",
      performance: "good",
      highlights: ["Longest session this week"]
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Average</Badge>;
      default:
        return <Badge variant="secondary">{performance}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Training Sessions
            </CardTitle>
            <CardDescription>Your last few training sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{session.date}</span>
                      {getPerformanceBadge(session.performance)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {session.location}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{session.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{session.maxSpeed}</div>
                    <div className="text-xs text-gray-500">Max Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{session.distance}</div>
                    <div className="text-xs text-gray-500">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">{session.kicks}</div>
                    <div className="text-xs text-gray-500">Kicks</div>
                  </div>
                </div>

                {session.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {session.highlights.map((highlight, index) => (
                      <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        ⭐ {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Goals & Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Goals & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekly Sessions</span>
                <span className="font-semibold">4/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Speed Goal</span>
                <span className="font-semibold">28.5/30 km/h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">Recent Achievements</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">🏆</div>
                  <span>Speed Demon - 28+ km/h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-silver-100 rounded-full flex items-center justify-center">🥈</div>
                  <span>Kick Master - 50+ kicks</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">4 sessions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Distance</span>
                <span className="font-semibold">32.8 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Speed</span>
                <span className="font-semibold">24.7 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Kicks</span>
                <span className="font-semibold">193</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentActivity;
