import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import { mapToPerformanceMetrics } from "@/utils/dataMapping";
import { useBluetooth } from "@/hooks/useBluetooth";

interface PerformanceTabProps {
  liveData: any;
  currentSession: number | null;
}

const PerformanceTab = ({ liveData, currentSession }: PerformanceTabProps) => {
  const { trackerData, isConnected } = useBluetooth();
  
  // Get performance metrics with proper Arduino data mapping
  const performanceMetrics = mapToPerformanceMetrics(
    isConnected ? trackerData : null,
    {}, // Historical data would come from your database
    {} // Session peaks would be tracked during active sessions
  );
  
  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground mt-2">Track your progress and analyze your game</p>
      </div>
      
      {/* Metrics Overview - Now uses properly mapped Arduino data */}
      <MetricsOverview liveData={currentSession ? liveData : null} />

      {/* Performance Chart - Enhanced with real Arduino data context */}
      <PerformanceChart performanceMetrics={performanceMetrics} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default PerformanceTab;
