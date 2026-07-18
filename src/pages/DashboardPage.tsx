import React, { useEffect, useState } from "react";
import { 
  PlusCircle, RefreshCw, ArrowUpRight
} from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { AnalyticsDashboardData } from "../types.js";
import { MetricsSkeleton, ChartSkeleton } from "../components/Skeletons.js";

export const DashboardPage: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await api.analytics.getDashboardData();
      setData(res);
    } catch (err: any) {
      console.error(err);
      toast.error("Couldn't load your dashboard data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center">
          <div className="h-8 w-44 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <MetricsSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  const metrics = data?.metrics || { totalUrls: 0, totalClicks: 0, activeUrls: 0, favoriteUrls: 0 };
  const mostVisited = data?.mostVisited || [];
  const recentUrls = data?.recentUrls || [];
  const dailyClicks = data?.dailyClicks || [];

  const maxClicks = Math.max(...dailyClicks.map((d) => d.clicks), 5);

  const statCards = [
    { emoji: "🔗", label: "Total Links", value: metrics.totalUrls, accent: "from-blue-500 to-indigo-500" },
    { emoji: "👆", label: "Total Clicks", value: metrics.totalClicks, accent: "from-violet-500 to-purple-500" },
    { emoji: "⚡", label: "Active Links", value: metrics.activeUrls, accent: "from-emerald-500 to-teal-500" },
    { emoji: "⭐", label: "Favorites", value: metrics.favoriteUrls, accent: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="dashboard-title">
            Your Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Here's how your links are performing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 rounded-xl text-gray-600 dark:text-zinc-400 transition cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => handleNavigate("#/create")}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center gap-2 transition-all"
            id="dash-create-btn"
          >
            <PlusCircle className="w-4 h-4" />
            New Link
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={card.label} className={`p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-sm hover-lift transition-all animate-slideUp stagger-${i + 1}`} style={{ opacity: 0 }}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.emoji}</span>
              <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${card.accent} opacity-60`} />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                {card.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              📈 Clicks this week
            </h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Daily click activity over the last 7 days.
            </p>
          </div>
        </div>

        {dailyClicks.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400 dark:text-zinc-500 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
            No clicks yet. Share some links to see data here!
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="h-56 w-full flex items-end justify-between gap-1 sm:gap-3 bg-gray-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/50">
              {dailyClicks.map((d) => {
                const heightPercentage = Math.max((d.clicks / maxClicks) * 100, 4);

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="relative w-full flex items-end justify-center h-[90%]">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-150 bg-gray-900 dark:bg-zinc-800 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-10 text-center flex flex-col min-w-[50px]">
                        <span>{d.clicks} clicks</span>
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 dark:from-indigo-500 dark:to-violet-400 rounded-md transition duration-200 relative overflow-hidden"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 font-medium truncate max-w-full">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              🏆 Top performers
            </h2>
            <button
              onClick={() => handleNavigate("#/links")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 transition"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {mostVisited.length === 0 ? (
            <div className="text-center py-6 text-xs sm:text-sm text-gray-400 dark:text-zinc-500">
              No links to rank yet. Create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Link</th>
                    <th className="pb-3 font-semibold">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {mostVisited.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-3 pr-2 font-bold text-gray-800 dark:text-zinc-300 truncate max-w-[150px] sm:max-w-[220px]">
                        <a
                          href={`${window.location.protocol}//${window.location.host}/${u.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-indigo-600 dark:text-indigo-400"
                        >
                          {`/${u.shortCode}`}
                        </a>
                        <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-medium truncate">{u.originalUrl}</span>
                      </td>
                      <td className="py-3 font-bold text-gray-900 dark:text-white text-right sm:text-left">
                        {u.clicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Links */}
        <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              🕐 Recent links
            </h2>
            <button
              onClick={() => handleNavigate("#/links")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 transition"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentUrls.length === 0 ? (
            <div className="text-center py-6 text-xs sm:text-sm text-gray-400 dark:text-zinc-500">
              Nothing here yet. Go shorten a link!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Link</th>
                    <th className="pb-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {recentUrls.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-3 pr-2 font-bold text-gray-800 dark:text-zinc-300 truncate max-w-[150px] sm:max-w-[220px]">
                        <a
                          href={`${window.location.protocol}//${window.location.host}/${u.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-indigo-600 dark:text-indigo-400"
                        >
                          {`/${u.shortCode}`}
                        </a>
                        <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-medium truncate">{u.originalUrl}</span>
                      </td>
                      <td className="py-3 text-gray-500 dark:text-zinc-400 whitespace-nowrap text-right sm:text-left font-medium">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
