import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";

interface PerformanceTabProps {
  liveData: any;
  currentSession: number | null;
}

const PerformanceTab = ({ liveData, currentSession }: PerformanceTabProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground mt-2">Track your progress and analyze your game</p>
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
