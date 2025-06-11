
import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";

interface PerformanceTabProps {
  liveData: any;
  currentSession: number | null;
}

const PerformanceTab = ({ liveData, currentSession }: PerformanceTabProps) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Performance Stats</h2>
        <p className="text-sm text-muted-foreground">Track your progress and analyze your game</p>
      </div>
      
      {/* Metrics Overview */}
      <MetricsOverview liveData={currentSession ? liveData : null} />

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default PerformanceTab;
