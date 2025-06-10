
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Target, Trophy, Settings } from "lucide-react";

interface PlayerProfileProps {
  playerData: {
    name: string;
    position: string;
    team: string;
    avatar: string;
    level: string;
    weeklyGoal: number;
    currentStreak: number;
  };
  setPlayerData: (data: any) => void;
  onBack: () => void;
}

const PlayerProfile = ({ playerData, setPlayerData, onBack }: PlayerProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(playerData);

  const positions = [
    "Goalkeeper", "Defender", "Left-Back", "Right-Back", "Centre-Back",
    "Midfielder", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
    "Forward", "Striker", "Left Winger", "Right Winger"
  ];

  const levels = ["Beginner", "Amateur", "Semi-Pro", "Pro", "Elite"];

  const handleSave = () => {
    setPlayerData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(playerData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mobile-container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Player Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 p-1">
                    <Camera className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{formData.name}</h3>
                <p className="text-muted-foreground">{formData.position} • {formData.team}</p>
                <Badge variant="secondary" className="mt-1">{formData.level}</Badge>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goals Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5" />
                Training Goals
              </h4>
              <div className="space-y-2">
                <Label htmlFor="weeklyGoal">Weekly Training Sessions Goal</Label>
                <Input
                  id="weeklyGoal"
                  type="number"
                  min="1"
                  max="14"
                  value={formData.weeklyGoal}
                  onChange={(e) => setFormData({ ...formData, weeklyGoal: parseInt(e.target.value) || 1 })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Stats
            </CardTitle>
            <CardDescription>Your performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{playerData.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-500/10">
                <div className="text-2xl font-bold text-blue-400">23</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10">
                <div className="text-2xl font-bold text-green-400">127.3</div>
                <div className="text-sm text-muted-foreground">Total km</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-500/10">
                <div className="text-2xl font-bold text-purple-400">1247</div>
                <div className="text-sm text-muted-foreground">Total Kicks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerProfile;
