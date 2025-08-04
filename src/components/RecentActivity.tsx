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
    <div className="space-y-6">
      {/* Recent Training Sessions */}
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
            <div key={session.id} className="border border-primary/20 rounded-2xl p-6 hover:bg-card hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm group">
              {/* Header with date, location and performance badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {session.date}
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {session.location}
                  </div>
                </div>
                {getPerformanceBadge(session.performance)}
              </div>
              
              {/* Metrics in 2x2 grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center space-y-1 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    {session.duration.replace(' min', '')}
                  </div>
                  <div className="text-xs font-medium text-blue-400/80">mins</div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Duration</div>
                </div>
                
                <div className="text-center space-y-1 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                    {session.maxSpeed.replace(' km/h', '')}
                  </div>
                  <div className="text-xs font-medium text-green-400/80">km/h</div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Max Speed</div>
                </div>
                
                <div className="text-center space-y-1 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    {session.distance.replace(' km', '')}
                  </div>
                  <div className="text-xs font-medium text-purple-400/80">km</div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Distance</div>
                </div>
                
                <div className="text-center space-y-1 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                    {session.kicks}
                  </div>
                  <div className="text-xs font-medium text-orange-400/80"></div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Kicks</div>
                </div>
              </div>

              {/* Achievement highlights */}
              {session.highlights.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {session.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium group-hover:bg-yellow-500/20 group-hover:scale-105 transition-all duration-300">
                      <span className="text-yellow-500">⭐</span>
                      {highlight}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

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
  );
};

export default RecentActivity;