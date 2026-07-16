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
    },
    {
      label: "Shorten URL",
      path: "#/create",
      icon: PlusCircle,
    },
    {
      label: "My Links",
      path: "#/links",
      icon: Link,
    },
    {
      label: "Analytics",
      path: "#/analytics",
      icon: BarChart3,
    },
    {
      label: "Profile",
      path: "#/profile",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Desktop Left Sidebar: Fixed column */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-150 dark:border-zinc-800 bg-white dark:bg-[#09090b] h-[calc(100vh-4rem)] p-4 sticky top-16 justify-between select-none">
        <div className="flex flex-col gap-1.5">
          <div className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Navigation Menu
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 pl-3 shadow-sm shadow-blue-600/5"
                    : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/60 hover:text-gray-800 dark:hover:text-zinc-200"
                }`}
                id={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-zinc-550"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Sidebar Sign Out */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-gray-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/25 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
          id="sidebar-logout"
        >
          <LogOut className="w-5 h-5 shrink-0 text-gray-400 hover:text-rose-500 dark:text-zinc-550" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#09090b] border-t border-gray-150 dark:border-zinc-800 z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2 rounded-lg cursor-pointer ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-350"
              }`}
              id={`mobile-nav-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
