import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Medal } from "lucide-react";

interface BadgeUnlockPopupProps {
  badge: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
  isVisible: boolean;
}

const BadgeUnlockPopup = ({ badge, onClose, isVisible }: BadgeUnlockPopupProps) => {
  if (!isVisible) return null;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'target': return Target;
      case 'medal': return Medal;
      default: return Trophy;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      case 'rare': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'epic': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const IconComponent = getIcon(badge.icon);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center space-y-6 animate-scale-in">
        {/* Badge Icon with Glow Effect */}
        <div className="relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 ${getBadgeColor(badge.rarity)}`}>
            <IconComponent className="w-12 h-12" />
          </div>
          {badge.rarity === 'legendary' && (
            <div className="absolute inset-0 w-24 h-24 rounded-full mx-auto bg-yellow-400/20 animate-pulse" />
          )}
        </div>

        {/* Badge Title and Description */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Badge 
              variant="secondary" 
              className={`${getBadgeColor(badge.rarity)} text-xs uppercase tracking-wider`}
            >
              {badge.rarity}
            </Badge>
            <h2 className="text-2xl font-bold text-foreground">{badge.title}</h2>
          </div>
          <p className="text-muted-foreground">{badge.description}</p>
        </div>

        {/* Celebration Message */}
        <div className="space-y-2">
          <div className="text-4xl">🏆</div>
          <div className="text-lg font-semibold text-foreground">Badge Unlocked!</div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onClose}
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90"
        >
          Nice! 
        </Button>
      </div>
    </div>
  );
};

export default BadgeUnlockPopup;