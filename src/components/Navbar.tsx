import React from "react";
import { LogIn, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavigate("#/")}
          className="flex items-center gap-2.5 font-bold text-xl select-none cursor-pointer group"
          id="nav-logo"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300 inline-block">✂️</span>
          <span className="font-display tracking-tight text-slate-900 dark:text-white">LinkCut</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate("#/dashboard")}
                className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("#/profile")}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all border border-transparent dark:hover:border-zinc-800 cursor-pointer"
                title="Your profile"
                id="nav-profile"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/15">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:flex flex-col text-left pr-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 line-clamp-1 max-w-[120px]">
                    {user.name}
                  </span>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                title="Log out"
                id="nav-logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("#/login")}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                id="nav-login-btn"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Log in</span>
              </button>
              
              <button
                onClick={() => handleNavigate("#/register")}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
                id="nav-register-btn"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
