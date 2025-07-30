import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Target, Calendar, Trophy, Star, Flame } from "lucide-react";

interface WeeklyGoalProgressProps {
  onBack: () => void;
  currentWeek: {
    sessionsCompleted: number;
    sessionsTarget: number;
    currentStreak: number;
    weekNumber: number;
  };
  upcomingGoals: Array<{
    id: string;
    title: string;
    progress: number;
    target: number;
    unit: string;
    reward: string;
    deadline: string;
  }>;
}

const WeeklyGoalProgress = ({ 
  onBack, 
  currentWeek = { sessionsCompleted: 4, sessionsTarget: 5, currentStreak: 3, weekNumber: 12 },
  upcomingGoals = [
    { id: '1', title: 'Weekly Training', progress: 4, target: 5, unit: 'sessions', reward: 'Training Badge', deadline: '2 days' },
    { id: '2', title: 'Distance Goal', progress: 12.5, target: 15, unit: 'km', reward: 'Runner Badge', deadline: '5 days' },
    { id: '3', title: 'Speed Challenge', progress: 28.5, target: 30, unit: 'km/h', reward: 'Speed Demon', deadline: '1 week' }
  ]
}: WeeklyGoalProgressProps) => {
  
  const weekProgress = (currentWeek.sessionsCompleted / currentWeek.sessionsTarget) * 100;
  const isWeekComplete = currentWeek.sessionsCompleted >= currentWeek.sessionsTarget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ScrollArea className="h-screen">
        <div className="px-4 py-6 max-w-sm mx-auto pb-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Weekly Goals</h1>
          </div>

          {/* Current Week Progress */}
          <Card className="mb-6 bg-primary/10 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Week {currentWeek.weekNumber} Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Training Sessions</span>
                  <span className="text-sm font-medium text-foreground">
                    {currentWeek.sessionsCompleted} of {currentWeek.sessionsTarget}
                  </span>
                </div>
                <Progress value={weekProgress} className="h-3" />
                <div className="text-center">
                  {isWeekComplete ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      ✓ Week Complete!
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {currentWeek.sessionsTarget - currentWeek.sessionsCompleted} sessions remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Streak Counter */}
              <div className="flex items-center justify-center gap-2 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-500" />
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">{currentWeek.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Goals */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Goals
            </h2>

            {upcomingGoals.map((goal) => {
              const progress = (goal.progress / goal.target) * 100;
              const isComplete = goal.progress >= goal.target;

              return (
                <Card key={goal.id} className="bg-card/80 backdrop-blur-sm border-border">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground">Deadline: {goal.deadline}</p>
                      </div>
                      {isComplete && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Trophy className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium text-foreground">
                          {goal.progress} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-400">Reward: {goal.reward}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Motivation Section */}
          <Card className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="pt-4 text-center space-y-3">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-foreground">Keep Going!</h3>
                <p className="text-sm text-muted-foreground">
                  You're {Math.round((currentWeek.sessionsCompleted / currentWeek.sessionsTarget) * 100)}% through this week's goal
                </p>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {isWeekComplete ? 'Week Champion' : 'Almost There!'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default WeeklyGoalProgress;