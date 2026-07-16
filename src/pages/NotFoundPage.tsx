import React from "react";
import { Link2, ArrowLeft, Home } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 transition-colors">
      <div className="text-center space-y-6 max-w-md">
        {/* Animated Visual Logo */}
        <div className="relative inline-flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-3xl select-none mx-auto">
          <Link2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
            404
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-display">
            Short URL Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            The link you followed has either expired, been disabled by its owner, or doesn't exist in our routing tables.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigateTo("#/")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home Page
          </button>
          
          <button
            onClick={() => {
              window.history.back();
            }}
            className="px-5 py-2.5 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-150 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm rounded-xl cursor-pointer transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
