
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Target, Trophy, Award, Edit, Trash2 } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  type: string;
  reward: string;
}

interface GoalsRewardsProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  onBack: () => void;
}

const GoalsRewards = ({ goals, setGoals, onBack }: GoalsRewardsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    target: 0,
    type: "sessions",
    reward: ""
  });

  const goalTypes = [
    { value: "sessions", label: "Training Sessions" },
    { value: "speed", label: "Max Speed (km/h)" },
    { value: "distance", label: "Distance (km)" },
    { value: "kicks", label: "Total Kicks" },
    { value: "streak", label: "Daily Streak" }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first training session", icon: "🎯", earned: true },
    { id: 2, title: "Speed Demon", description: "Reach 25+ km/h in a session", icon: "⚡", earned: true },
    { id: 3, title: "Consistency King", description: "Maintain a 7-day streak", icon: "👑", earned: false },
    { id: 4, title: "Distance Master", description: "Run 100km total", icon: "🏃", earned: false },
    { id: 5, title: "Kick Champion", description: "1000 total kicks recorded", icon: "⚽", earned: true }
  ];

  const handleSave = () => {
    if (editingId) {
      setGoals(goals.map(goal => 
        goal.id === editingId 
          ? { ...goal, ...formData, current: goal.current }
          : goal
      ));
      setEditingId(null);
    } else {
      const newGoal = {
        id: Date.now(),
        ...formData,
        current: 0
      };
      setGoals([...goals, newGoal]);
      setIsCreating(false);
    }
    setFormData({ title: "", target: 0, type: "sessions", reward: "" });
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      target: goal.target,
      type: goal.type,
      reward: goal.reward
    });
    setEditingId(goal.id);
  };

  const handleDelete = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-primary";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-area-inset px-4 py-6 space-y-6 max-w-sm mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Goals & Rewards</h1>
        </div>

        {/* Current Goals */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-4 h-4" />
                Your Goals
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => setIsCreating(true)}
                disabled={isCreating || editingId !== null}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100);
              const isCompleted = percentage >= 100;
              
              return (
                <div key={goal.id} className="space-y-3 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {goal.current}/{goal.target} {goal.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Badge className="bg-green-500 text-white text-xs">Complete!</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Reward: {goal.reward}</span>
                      <span className="font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create/Edit Goal Form */}
            {(isCreating || editingId) && (
              <div className="space-y-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h4 className="font-medium text-sm">
                  {editingId ? 'Edit Goal' : 'Create New Goal'}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title" className="text-xs">Goal Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Weekly Training"
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="target" className="text-xs">Target</Label>
                      <Input
                        id="target"
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })}
                        className="h-9 text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type" className="text-xs">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {goalTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="reward" className="text-xs">Reward</Label>
                    <Input
                      id="reward"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                      placeholder="e.g., Training Badge"
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={!formData.title || !formData.target || !formData.reward}
                      className="flex-1"
                    >
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsCreating(false);
                        setEditingId(null);
                        setFormData({ title: "", target: 0, type: "sessions", reward: "" });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="w-4 h-4" />
              Achievements
            </CardTitle>
            <CardDescription className="text-xs">
              Unlock rewards by reaching milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'border-green-500/20 bg-green-500/10' 
                    : 'border-border/50 bg-muted/5'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsRewards;
