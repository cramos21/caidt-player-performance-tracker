import { useEffect, useState } from "react";
import appIcon from "@/assets/app-icon.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center animate-scale-out">
          <img src={appIcon} alt="App Icon" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Player Performance</h1>
          <h2 className="text-3xl font-bold text-white">Tracker</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <img src={appIcon} alt="App Icon" className="w-24 h-24 mx-auto mb-6 animate-scale-in" />
        <h1 className="text-3xl font-bold text-white mb-2">Player Performance</h1>
        <h2 className="text-3xl font-bold text-white">Tracker</h2>
      </div>
    </div>
  );
};

export default SplashScreen;