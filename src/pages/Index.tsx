import { useState, useEffect } from "react";
import PlayerProfile from "@/components/PlayerProfile";
import GoalsRewards from "@/components/GoalsRewards";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardTab from "@/components/DashboardTab";
import PerformanceTab from "@/components/PerformanceTab";
import TrainingTab from "@/components/TrainingTab";
import SplashScreen from "@/components/SplashScreen";
import FreePlayTraining from "@/components/training/FreePlayTraining";
import SkillTraining from "@/components/training/SkillTraining";
import EnduranceTraining from "@/components/training/EnduranceTraining";
import PerformanceTest from "@/components/training/PerformanceTest";
import BluetoothDebugger from "@/components/BluetoothDebugger";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showGoalsRewards, setShowGoalsRewards] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [currentTrainingType, setCurrentTrainingType] = useState<string | null>(null);
  
  // Player data - would come from your backend
  const [playerData, setPlayerData] = useState({
    name: "Alex Johnson",
    position: "Midfielder",
    team: "FC Thunder",
    avatar: "/src/assets/soccer-player-avatar.jpg",
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

  // Listen for navigation events from dashboard
  useEffect(() => {
    const handleNavigateToAccount = () => setActiveTab('account');
    const handleNavigateToGoals = () => setActiveTab('goals');
    const handleTrackerConnected = (event: any) => {
      console.log('Tracker connected from debug page:', event.detail);
      setIsConnected(true);
      toast.success('Arduino connected! You can now start tracking.');
    };
    
    window.addEventListener('navigate-to-account', handleNavigateToAccount);
    window.addEventListener('navigate-to-goals', handleNavigateToGoals);
    window.addEventListener('tracker-connected', handleTrackerConnected);
    
    return () => {
      window.removeEventListener('navigate-to-account', handleNavigateToAccount);
      window.removeEventListener('navigate-to-goals', handleNavigateToGoals);
      window.removeEventListener('tracker-connected', handleTrackerConnected);
    };
  }, []);

  // Define handleStartTraining function
  const handleStartTraining = () => {
    // Navigate to dashboard and trigger training start
    setActiveTab('dashboard');
    // This would trigger the training flow in DashboardTab
  };

  // Removed splash screen as requested

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4 py-6 max-w-sm mx-auto pb-32">
          <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (showGoalsRewards) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4 py-6 max-w-sm mx-auto pb-32">
          <GoalsRewards goals={goals} setGoals={setGoals} />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Handle training type screens
  if (currentTrainingType) {
    const handleBackToTraining = () => {
      setCurrentTrainingType(null);
      setActiveTab('training');
    };

    const trainingComponents = {
      'free-play': <FreePlayTraining onBack={handleBackToTraining} onStartTraining={handleStartTraining} isConnected={isConnected} />,
      'skill-training': <SkillTraining onBack={handleBackToTraining} onStartTraining={handleStartTraining} isConnected={isConnected} />,
      'endurance': <EnduranceTraining onBack={handleBackToTraining} onStartTraining={handleStartTraining} isConnected={isConnected} />,
      'performance': <PerformanceTest onBack={handleBackToTraining} onStartTraining={handleStartTraining} isConnected={isConnected} />
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4 py-6 max-w-sm mx-auto pb-32">
          {trainingComponents[currentTrainingType]}
        </div>
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setCurrentTrainingType(null); // Reset training type when navigating away
            setActiveTab(tab);
          }} 
        />
      </div>
    );
  }

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
        return <TrainingTab onStartTraining={handleStartTraining} isConnected={isConnected} onTrainingTypeSelect={setCurrentTrainingType} />;
      case 'goals':
        return <GoalsRewards goals={goals} setGoals={setGoals} />;
      case 'account':
        return <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />;
      case 'debug':
        return <BluetoothDebugger />;
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
