import { useState, useEffect } from "react";
import PlayerProfile from "@/components/PlayerProfile";
import GoalsRewards from "@/components/GoalsRewards";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardTab from "@/components/DashboardTab";
import PerformanceTab from "@/components/PerformanceTab";
import TrainingTab from "@/components/TrainingTab";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showGoalsRewards, setShowGoalsRewards] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Player data - would come from your backend
  const [playerData, setPlayerData] = useState({
    name: "Alex Johnson",
    position: "Midfielder",
    team: "FC Thunder",
    avatar: "",
    level: "Pro",
    weeklyGoal: 5,
    currentStreak: 3
  });

  // Mock real-time data
  const [liveData, setLiveData] = useState({
    speed: 0,
    distance: 0,
    kicks: 0,
    duration: 0
  });

  // Mock goals data
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Weekly Training",
      target: playerData.weeklyGoal,
      current: 4,
      type: "sessions",
      reward: "Training Badge"
    },
    {
      id: 2,
      title: "Speed Goal",
      target: 30,
      current: 28.5,
      type: "speed",
      reward: "Speed Demon Badge"
    },
    {
      id: 3,
      title: "Distance Challenge",
      target: 50,
      current: 32.8,
      type: "distance",
      reward: "Marathon Runner"
    }
  ]);

  // Simulate live data updates when connected
  useEffect(() => {
    let interval;
    if (isConnected && currentSession) {
      interval = setInterval(() => {
        setLiveData(prev => ({
          speed: Math.random() * 25 + 5,
          distance: prev.distance + (Math.random() * 0.05),
          kicks: prev.kicks + (Math.random() > 0.7 ? 1 : 0),
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, currentSession]);

  if (showProfile) {
    return <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />;
  }

  if (showGoalsRewards) {
    return <GoalsRewards goals={goals} setGoals={setGoals} />;
  }

  const handleStartTraining = () => {
    // Navigate to dashboard and trigger training start
    setActiveTab('dashboard');
    // This would trigger the training flow in DashboardTab
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            liveData={liveData}
            setLiveData={setLiveData}
            playerData={playerData}
            onShowProfile={() => setShowProfile(true)}
            goals={goals}
            onShowGoals={() => setShowGoalsRewards(true)}
          />
        );
      case 'performance':
        return <PerformanceTab liveData={liveData} currentSession={currentSession} />;
      case 'training':
        return <TrainingTab onStartTraining={handleStartTraining} />;
      case 'goals':
        return <GoalsRewards goals={goals} setGoals={setGoals} />;
      case 'account':
        return <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-4 py-6 max-w-sm mx-auto pb-32">
        {renderTabContent()}
      </div>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
