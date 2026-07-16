import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { ToastProvider } from "./context/ToastContext.js";
import { Navbar } from "./components/Navbar.js";
import { Sidebar } from "./components/Sidebar.js";

// Page Imports
import { LandingPage } from "./pages/LandingPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { CreateUrlPage } from "./pages/CreateUrlPage.js";
import { LinksPage } from "./pages/LinksPage.js";
import { AnalyticsPage } from "./pages/AnalyticsPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { UnlockPage } from "./pages/UnlockPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.hash || "#/");

  // Sync hash changes to local path state
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || "#/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Global loading state on app mount/session validation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center gap-4 text-gray-500 transition-colors">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">Initializing LinkCut...</span>
      </div>
    );
  }

  // Parse path and route variables (e.g. #/unlock/code)
  let viewPath = currentPath;
  if (currentPath.startsWith("#/unlock/")) {
    viewPath = "#/unlock";
  }

  // Determine if path is part of private dashboard area
  const privatePaths = ["#/dashboard", "#/create", "#/links", "#/analytics", "#/profile"];
  const isPrivatePath = privatePaths.includes(viewPath);

  // Authenticated Route Protection
  if (isPrivatePath && !isAuthenticated) {
    // Force redirect to login page
    window.location.hash = "#/login";
    return null;
  }

  // Also redirect logged-in users away from auth pages
  if (isAuthenticated && (viewPath === "#/login" || viewPath === "#/register")) {
    window.location.hash = "#/dashboard";
    return null;
  }

  // Router matching logic
  const renderPage = () => {
    switch (viewPath) {
      case "#/":
        return <LandingPage />;
      case "#/login":
        return <LoginPage />;
      case "#/register":
        return <RegisterPage />;
      case "#/dashboard":
        return <DashboardPage />;
      case "#/create":
        return <CreateUrlPage />;
      case "#/links":
        return <LinksPage />;
      case "#/analytics":
        return <AnalyticsPage />;
      case "#/profile":
        return <ProfilePage />;
      case "#/unlock":
        return <UnlockPage />;
      case "#/404":
        return <NotFoundPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors flex flex-col font-sans">
      <Navbar />

      {/* Main Container Layout */}
      {isPrivatePath ? (
        // Dashboard Shell layout (Sidebar + main layout)
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto pb-16 md:pb-0">
          <Sidebar currentPath={currentPath} />
          <main className="flex-1 min-w-0">
            {renderPage()}
          </main>
        </div>
      ) : (
        // Guest pages layout (Home, login, unlock, register)
        <main className="flex-1">
          {renderPage()}
        </main>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
