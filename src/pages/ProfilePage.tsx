import React, { useEffect, useState } from "react";
import { 
  Award, BarChart3, Calendar, Mail, User as UserIcon, ShieldCheck, 
  Database, Terminal 
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<{ totalUrls: number; totalClicks: number } | null>(null);

  useEffect(() => {
    const fetchProfileMetrics = async () => {
      try {
        const res = await api.analytics.getDashboardData();
        setMetrics({
          totalUrls: res.metrics.totalUrls,
          totalClicks: res.metrics.totalClicks,
        });
      } catch (error) {
        console.error("Failed to load profile metrics:", error);
      }
    };

    fetchProfileMetrics();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="border-b border-gray-150 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="profile-page-title">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Review your account registration and cloud database configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card Column */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 rounded-2xl shadow-sm text-center space-y-5">
          <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center rounded-3xl text-2xl font-bold mx-auto shadow-lg shadow-blue-600/20">
            {user ? user.name.substring(0, 2).toUpperCase() : "U"}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">{user?.name}</h2>
            <p className="text-xs text-gray-400 dark:text-zinc-500">{user?.email}</p>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-4 grid grid-cols-2 gap-2 text-center select-none font-semibold">
            <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150/50 dark:border-zinc-800/30">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Links Created</div>
              <div className="text-lg font-bold text-gray-800 dark:text-zinc-200 mt-1">
                {metrics ? metrics.totalUrls : "-"}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150/50 dark:border-zinc-800/30">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Scans</div>
              <div className="text-lg font-bold text-gray-800 dark:text-zinc-200 mt-1">
                {metrics ? metrics.totalClicks : "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 justify-center">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Joined on {user ? formatDate(user.createdAt) : "-"}</span>
          </div>
        </div>

        {/* Database Configuration and Secret Instructions Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2.5 font-display">
              <Database className="w-5 h-5 text-blue-500" />
              Production Deployment Config
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              This LinkCut application is fully persistent in the local environment using an auto-saving filesystem JSON engine. To migrate your server to MongoDB Atlas for cloud deployment:
            </p>

            <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850/80 text-[11px] font-mono text-gray-600 dark:text-zinc-450 leading-relaxed space-y-3">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold uppercase select-none">
                <Terminal className="w-3.5 h-3.5" /> step 1: Environment Declarations
              </div>
              <p>Configure the following secrets in your Vercel/Render settings panels:</p>
              <p className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-gray-150 dark:border-zinc-800">
                MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/linkcut" <br />
                JWT_SECRET="your-private-production-jwt-string"
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white font-display">Security Hardening Configured</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 leading-relaxed">
                All client sessions are secured via secure-signed JSON Web Tokens (JWT). Link password protection is safely stored in our database using standard salted `bcryptjs` encryption hashing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
