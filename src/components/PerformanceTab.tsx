import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import { mapToPerformanceMetrics } from "@/utils/dataMapping";

interface PerformanceTabProps {
  liveData: any;
  currentSession: number | null;
}

const PerformanceTab = ({ liveData, currentSession }: PerformanceTabProps) => {
  // Build performance metrics from the current session's live data.
  // (If you later add historical/session-peaks, pass them into the 2nd/3rd args.)
  const performanceMetrics = mapToPerformanceMetrics(
    currentSession ? liveData : null,
    {}, // historical
    {}  // session peaks
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Title — match top padding used elsewhere */}
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Track your progress and analyze your game
        </p>
      </div>

      {/* Metrics Overview — show only while a session is active */}
      <MetricsOverview liveData={currentSession ? liveData : null} />

      {/* Performance Chart */}
      <PerformanceChart performanceMetrics={performanceMetrics} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default PerformanceTab;