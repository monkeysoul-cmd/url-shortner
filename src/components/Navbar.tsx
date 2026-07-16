import React from "react";
import { Link2, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { ThemeToggle } from "./ThemeToggle.js";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-150 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <button
          onClick={() => handleNavigate("#/")}
          className="flex items-center gap-2.5 font-bold text-xl text-blue-600 dark:text-blue-400 select-none cursor-pointer group"
          id="nav-logo"
        >
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-display tracking-tight text-slate-900 dark:text-white">LinkCut</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Go to Dashboard Shortcut if on Landing */}
              <button
                onClick={() => handleNavigate("#/dashboard")}
                className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                My Dashboard
              </button>

              {/* User Avatar & Dropdown */}
              <button
                onClick={() => handleNavigate("#/profile")}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all border border-transparent dark:hover:border-zinc-800 cursor-pointer"
                title="View Profile Settings"
                id="nav-profile"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/15">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:flex flex-col text-left pr-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 line-clamp-1 max-w-[120px]">
                    {user.name}
                  </span>
                </div>
              </button>

              {/* Quick Logout */}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                title="Log Out Session"
                id="nav-logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("#/login")}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                id="nav-login-btn"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Log In</span>
              </button>
              
              <button
                onClick={() => handleNavigate("#/register")}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/10 dark:shadow-blue-500/10 transition-all cursor-pointer"
                id="nav-register-btn"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
