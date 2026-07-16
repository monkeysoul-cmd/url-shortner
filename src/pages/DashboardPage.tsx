import React, { useEffect, useState } from "react";
import { 
  BarChart3, Calendar, Link2, MousePointerClick, 
  PlusCircle, Star, ToggleRight, ArrowUpRight, Loader2, RefreshCw 
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
      toast.error("Failed to load dashboard statistics.");
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

  // Fallback if data is missing or empty
  const metrics = data?.metrics || { totalUrls: 0, totalClicks: 0, activeUrls: 0, favoriteUrls: 0 };
  const mostVisited = data?.mostVisited || [];
  const recentUrls = data?.recentUrls || [];
  const dailyClicks = data?.dailyClicks || [];

  // Find max clicks to scale the SVG chart correctly
  const maxClicks = Math.max(...dailyClicks.map((d) => d.clicks), 5);

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Upper Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="dashboard-title">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Real-time link click metrics and recent url analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh statistics */}
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-150 dark:border-zinc-800 rounded-xl text-gray-600 dark:text-zinc-400 transition cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Create URL shortcut */}
          <button
            onClick={() => handleNavigate("#/create")}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-600/10 cursor-pointer flex items-center gap-2 transition"
            id="dash-create-btn"
          >
            <PlusCircle className="w-4 h-4" />
            Shorten New
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total URLs */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Links
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display" id="stat-total-links">
              {metrics.totalUrls}
            </div>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Clicks
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display" id="stat-total-clicks">
              {metrics.totalClicks}
            </div>
          </div>
        </div>

        {/* Active URLs */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ToggleRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Active Links
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display">
              {metrics.activeUrls}
            </div>
          </div>
        </div>

        {/* Favorite URLs */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Favorites
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 font-display">
              {metrics.favoriteUrls}
            </div>
          </div>
        </div>
      </div>

      {/* Click Activity Area (Custom responsive SVG bar chart) */}
      <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Redirect Click Analytics
            </h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Distribution of clicks recorded over the last 7 active days.
            </p>
          </div>
        </div>

        {/* The SVG Chart Viewport */}
        {dailyClicks.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400 dark:text-zinc-500 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
            No redirection clicks recorded yet. Shorten links and scan them!
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="h-56 w-full flex items-end justify-between gap-1 sm:gap-3 bg-gray-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-gray-150 dark:border-zinc-800/50">
              {dailyClicks.map((d) => {
                const heightPercentage = Math.max((d.clicks / maxClicks) * 100, 4); // minimum height of 4% for style consistency

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="relative w-full flex items-end justify-center h-[90%]">
                      {/* Interactive Hover Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-150 bg-gray-900 dark:bg-zinc-800 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-10 text-center flex flex-col min-w-[50px]">
                        <span>{d.clicks} clicks</span>
                      </div>

                      {/* Bar Column */}
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-md transition duration-200 relative overflow-hidden"
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

      {/* Top 5 Visited & Recent URLs split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Visited links table */}
        <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Most Visited Links
            </h2>
            <button
              onClick={() => handleNavigate("#/links")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 transition"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {mostVisited.length === 0 ? (
            <div className="text-center py-6 text-xs sm:text-sm text-gray-400 dark:text-zinc-500">
              No links available to rank.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Short Link</th>
                    <th className="pb-3 font-semibold">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {mostVisited.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-3 pr-2 font-bold text-gray-800 dark:text-zinc-300 truncate max-w-[150px] sm:max-w-[220px]">
                        <a
                          href={`/${u.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-blue-600 dark:text-blue-400"
                        >
                          /{u.shortCode}
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

        {/* Recent URLs table */}
        <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
              <Calendar className="w-4 h-4 text-blue-500" />
              Recently Shortened
            </h2>
            <button
              onClick={() => handleNavigate("#/links")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 transition"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentUrls.length === 0 ? (
            <div className="text-center py-6 text-xs sm:text-sm text-gray-400 dark:text-zinc-500">
              No recent shortened URLs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Short Link</th>
                    <th className="pb-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {recentUrls.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-3 pr-2 font-bold text-gray-800 dark:text-zinc-300 truncate max-w-[150px] sm:max-w-[220px]">
                        <a
                          href={`/${u.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-blue-600 dark:text-blue-400"
                        >
                          /{u.shortCode}
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
