
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Target, Trophy, Settings, Upload } from "lucide-react";

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
}

const PlayerProfile = ({ playerData, setPlayerData }: PlayerProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(playerData);

  const positions = [
    "Goalkeeper", "Defender", "Left-Back", "Right-Back", "Centre-Back",
    "Midfielder", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
    "Forward", "Striker", "Left Winger", "Right Winger"
  ];

  const levels = ["Beginner", "Amateur", "Semi-Pro", "Pro", "Elite"];

  // Sample avatar options (in a real app, these would be memoji or user uploaded images)
  const avatarOptions = [
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop&crop=face"
  ];

  const handleSave = () => {
    setPlayerData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(playerData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
      </div>

      {/* Profile Card */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Profile Settings
              </CardTitle>
              {!isEditing ? (
                <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                  <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Avatar Section with Customization */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 rounded-full" asChild>
                        <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center">
                          <Upload className="w-3 h-3" />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Options */}
              {isEditing && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Choose Avatar</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatarOptions.map((avatar, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-12 h-12 p-0 rounded-full ${
                          formData.avatar === avatar ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, avatar })}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>A{index + 1}</AvatarFallback>
                        </Avatar>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">{formData.name}</h3>
                <p className="text-muted-foreground text-sm">{formData.position} • {formData.team}</p>
                <Badge variant="secondary" className="mt-1 text-xs">{formData.level}</Badge>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="h-9 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="team" className="text-xs">Team</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    disabled={!isEditing}
                    className="h-9 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="level" className="text-xs">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="h-9 text-sm">
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

              <div>
                <Label htmlFor="position" className="text-xs">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goals Section */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Training Goals
              </h4>
              <div>
                <Label htmlFor="weeklyGoal" className="text-xs">Weekly Training Sessions Goal</Label>
                <Input
                  id="weeklyGoal"
                  type="number"
                  min="1"
                  max="14"
                  value={formData.weeklyGoal}
                  onChange={(e) => setFormData({ ...formData, weeklyGoal: parseInt(e.target.value) || 1 })}
                  disabled={!isEditing}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

  export default PlayerProfile;
