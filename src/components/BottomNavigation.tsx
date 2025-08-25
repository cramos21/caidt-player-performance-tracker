import { Home, TrendingUp, Target, User, Play } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "training", label: "Training", icon: Play },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "goals", label: "Goals", icon: Target },
  { id: "account", label: "Account", icon: User },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav
      data-bottom-nav
      className="fixed inset-x-0 bottom-0 z-40 bg-bottom-nav/95 backdrop-blur-md border-t border-border/30"
      // Only the iOS home-indicator safe area; NO extra pb-* anywhere else
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* compact row; height controlled by py-2 only */}
      <div className="mx-auto max-w-sm px-4 py-2 grid grid-cols-5 gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors
                ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-none font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;