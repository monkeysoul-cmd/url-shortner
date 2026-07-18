import React from "react";
import { BarChart3, LayoutDashboard, Link, PlusCircle, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  const navItems = [
    {
      label: "Overview",
      path: "#/dashboard",
      icon: LayoutDashboard,
      emoji: "📋",
    },
    {
      label: "New Link",
      path: "#/create",
      icon: PlusCircle,
      emoji: "✂️",
    },
    {
      label: "My Links",
      path: "#/links",
      icon: Link,
      emoji: "🔗",
    },
    {
      label: "Analytics",
      path: "#/analytics",
      icon: BarChart3,
      emoji: "📊",
    },
    {
      label: "Settings",
      path: "#/profile",
      icon: Settings,
      emoji: "⚙️",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-sm h-[calc(100vh-4rem)] p-4 sticky top-16 justify-between select-none">
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Menu
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 text-indigo-700 dark:text-indigo-300 shadow-sm"
                    : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/60 hover:text-gray-800 dark:hover:text-zinc-200"
                }`}
                id={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className={`text-base transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.emoji}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-gray-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/25 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
          id="sidebar-logout"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Log out</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-350"
              }`}
              id={`mobile-nav-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className={`text-lg ${isActive ? "scale-110" : ""} transition-transform`}>{item.emoji}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
