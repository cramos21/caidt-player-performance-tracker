import { SoccerTrackerData } from '@/hooks/useBluetooth';

// Data mapping utilities for Arduino data to UI components

export interface DashboardStats {
  sessionsCompleted: number;
  totalDistance: number;
  avgSpeed: number;
  totalKicks: number;
  caloriesBurned: number;
}

export interface LiveSessionData {
  speed: number;
  distance: number;
  kicks: number;
  duration: number; // in seconds
}

export interface PerformanceMetrics {
  currentSpeed: number;
  maxSpeed: number;
  avgSpeed: number;
  totalDistance: number;
  sessionDistance: number;
  totalKicks: number;
  sessionKicks: number;
  sessionTime: number;
  heartRate?: number;
}

// Map Arduino data to Dashboard "Today's Progress" stats
export const mapToDashboardStats = (
  trackerData: SoccerTrackerData | null,
  lastSessionData: any = null,
  isActiveSession: boolean = false
): DashboardStats => {
  const activeData = isActiveSession ? trackerData : null;
  
  return {
    sessionsCompleted: lastSessionData ? 1 : (activeData ? 1 : 0),
    totalDistance: lastSessionData?.distance || activeData?.distance || 0,
    avgSpeed: lastSessionData?.maxSpeed || (activeData?.speed > 0 ? activeData.speed : 0) || 0,
    totalKicks: lastSessionData?.kicks || activeData?.kicks || 0,
    caloriesBurned: lastSessionData 
      ? Math.floor((lastSessionData.sessionTime * 60) * 4.5) // 4.5 calories per minute estimate
      : (activeData ? Math.floor((activeData.sessionTime * 60) * 4.5) : 0)
  };
};

// Map Arduino data to Live Session format (used during training)
export const mapToLiveSessionData = (trackerData: SoccerTrackerData | null): LiveSessionData => {
  if (!trackerData) {
    return { speed: 0, distance: 0, kicks: 0, duration: 0 };
  }
  
  return {
    speed: trackerData.speed,
    distance: trackerData.distance,
    kicks: trackerData.kicks,
    duration: trackerData.sessionTime * 60 // Convert minutes to seconds for UI consistency
  };
};

// Map Arduino data to Performance Tab metrics
export const mapToPerformanceMetrics = (
  trackerData: SoccerTrackerData | null,
  historicalData: any = {},
  sessionPeaks: any = {}
): PerformanceMetrics => {
  const currentSpeed = trackerData?.speed || 0;
  const currentDistance = trackerData?.distance || 0;
  const currentKicks = trackerData?.kicks || 0;
  const currentSessionTime = trackerData?.sessionTime || 0;
  
  return {
    currentSpeed,
    maxSpeed: Math.max(sessionPeaks.maxSpeed || 0, currentSpeed, historicalData.maxSpeed || 0),
    avgSpeed: historicalData.avgSpeed || (currentSpeed > 0 ? currentSpeed : 0),
    totalDistance: (historicalData.totalDistance || 0) + currentDistance,
    sessionDistance: currentDistance,
    totalKicks: (historicalData.totalKicks || 0) + currentKicks,
    sessionKicks: currentKicks,
    sessionTime: currentSessionTime,
    heartRate: undefined // Arduino doesn't provide heart rate, but structure is ready for future expansion
  };
};

// Format time from minutes to MM:SS
export const formatSessionTime = (timeInMinutes: number): string => {
  const totalSeconds = Math.floor(timeInMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Calculate session performance scores
export const calculatePerformanceScore = (
  trackerData: SoccerTrackerData | null,
  personalBests: any = {}
): {
  speedScore: number;
  distanceScore: number;
  kicksScore: number;
  overallScore: number;
} => {
  if (!trackerData) {
    return { speedScore: 0, distanceScore: 0, kicksScore: 0, overallScore: 0 };
  }
  
  const speedScore = personalBests.maxSpeed 
    ? Math.min((trackerData.speed / personalBests.maxSpeed) * 100, 100)
    : Math.min(trackerData.speed * 3, 100); // Fallback scoring
    
  const distanceScore = personalBests.maxDistance
    ? Math.min((trackerData.distance / personalBests.maxDistance) * 100, 100)
    : Math.min(trackerData.distance * 20, 100); // Fallback scoring
    
  const kicksScore = personalBests.maxKicks
    ? Math.min((trackerData.kicks / personalBests.maxKicks) * 100, 100)
    : Math.min(trackerData.kicks * 2, 100); // Fallback scoring
  
  const overallScore = (speedScore + distanceScore + kicksScore) / 3;
  
  return { speedScore, distanceScore, kicksScore, overallScore };
};

// Generate session summary data for post-training analysis
export const generateSessionSummary = (
  trackerData: SoccerTrackerData | null,
  sessionPeaks: any = {},
  personalBests: any = {}
) => {
  if (!trackerData) return null;
  
  const duration = trackerData.sessionTime * 60; // Convert to seconds
  const scores = calculatePerformanceScore(trackerData, personalBests);
  
  // Check for new personal bests
  const newPersonalBests = {
    maxSpeed: trackerData.speed > (personalBests.maxSpeed || 0),
    maxDistance: trackerData.distance > (personalBests.maxDistance || 0),
    maxKicks: trackerData.kicks > (personalBests.maxKicks || 0)
  };
  
  return {
    duration,
    distance: trackerData.distance,
    maxSpeed: Math.max(sessionPeaks.maxSpeed || 0, trackerData.speed),
    avgSpeed: sessionPeaks.avgSpeed || trackerData.speed,
    kicks: trackerData.kicks,
    calories: Math.floor(duration * 4.5),
    scores,
    personalBests: newPersonalBests,
    sessionDate: new Date().toISOString()
  };
};