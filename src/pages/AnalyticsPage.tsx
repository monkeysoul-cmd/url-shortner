import React, { useEffect, useState } from "react";
import { 
  BarChart3, Globe, Laptop, Smartphone, Monitor, Globe2, 
  HelpCircle, RefreshCw, Layers 
} from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { AnalyticsDashboardData } from "../types.js";
import { ChartSkeleton } from "../components/Skeletons.js";

export const AnalyticsPage: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await api.analytics.getDashboardData();
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to compile analytics statistics.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-44 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const deviceStats = data?.deviceStats || [];
  const browserStats = data?.browserStats || [];
  const countryStats = data?.countryStats || [];
  const totalClicks = data?.metrics.totalClicks || 0;

  // Custom icon mapper for device list
  const getDeviceIcon = (name: string) => {
    if (name.toLowerCase() === "mobile") return Smartphone;
    if (name.toLowerCase() === "tablet") return Laptop;
    return Monitor;
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="analytics-page-title">
            Link Analytics Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Analyze client metrics, device platforms, and client software distribution share.
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={isRefreshing}
          className="p-2 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-150 dark:border-zinc-800 rounded-xl text-gray-600 dark:text-zinc-400 transition cursor-pointer disabled:opacity-50 flex items-center justify-center self-start"
          title="Refresh analytics data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
        </button>
      </div>

      {totalClicks === 0 ? (
        <div className="p-10 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl text-center shadow-sm space-y-4 max-w-lg mx-auto mt-12">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gray-800 dark:text-zinc-200 font-display">No Audience Data Collected</h3>
            <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
              We haven't received any redirection logs yet. Share your shortened URLs to compile browser and country reports!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Section 1: Device Platforms shares */}
          <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
                <Laptop className="w-4.5 h-4.5 text-blue-500" />
                Device Distribution Share
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                Distribution of user platforms accessing links.
              </p>
            </div>

            <div className="space-y-5">
              {deviceStats.map((stat) => {
                const Icon = getDeviceIcon(stat.name);
                return (
                  <div key={stat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                        <span>{stat.name}</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {stat.percentage}% <span className="text-gray-400 font-medium text-[10px] sm:text-xs">({stat.count})</span>
                      </span>
                    </div>

                    {/* Progress slider gauge */}
                    <div className="w-full h-2 bg-gray-50 dark:bg-zinc-950 rounded-full overflow-hidden border border-gray-150/20 dark:border-zinc-800/20">
                      <div
                        style={{ width: `${stat.percentage}%` }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Browser software shares */}
          <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
                <Layers className="w-4.5 h-4.5 text-blue-500" />
                Browser Engine Distribution
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                Top browser client user agents detected.
              </p>
            </div>

            <div className="space-y-5">
              {browserStats.map((stat) => (
                <div key={stat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    <span>{stat.name}</span>
                    <span className="text-gray-900 dark:text-white">
                      {stat.percentage}% <span className="text-gray-400 font-medium text-[10px] sm:text-xs">({stat.count})</span>
                    </span>
                  </div>

                  {/* Progress slider gauge */}
                  <div className="w-full h-2 bg-gray-50 dark:bg-zinc-950 rounded-full overflow-hidden border border-gray-150/20 dark:border-zinc-800/20">
                    <div
                      style={{ width: `${stat.percentage}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Country demographics */}
          <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm md:col-span-2 xl:col-span-1 space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
                <Globe2 className="w-4.5 h-4.5 text-blue-500" />
                Country Demographics (Traced)
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                Estimated geographical origins of redirect triggers.
              </p>
            </div>

            <div className="space-y-5">
              {countryStats.map((stat) => (
                <div key={stat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      <span>{stat.name}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      {stat.percentage}% <span className="text-gray-400 font-medium text-[10px] sm:text-xs">({stat.count})</span>
                    </span>
                  </div>

                  {/* Progress slider gauge */}
                  <div className="w-full h-2 bg-gray-50 dark:bg-zinc-950 rounded-full overflow-hidden border border-gray-150/20 dark:border-zinc-800/20">
                    <div
                      style={{ width: `${stat.percentage}%` }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
