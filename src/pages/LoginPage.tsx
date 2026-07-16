import React, { useState } from "react";
import { Link2, Loader2, LogIn, Mail, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "../context/ToastContext.js";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      toast.success("Welcome back! Successfully logged in.");
      window.location.hash = "#/dashboard";
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Invalid email or password.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-250/20 dark:shadow-[#09090b]/40">
        {/* Header Logo */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-2">
            <Link2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Welcome back</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Sign in to cut links, brand aliases, and see click statistics.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 mb-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 font-medium animate-scaleIn">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-400 dark:text-zinc-500 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
                placeholder="you@example.com"
                id="login-email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider block">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
              placeholder="••••••••"
              id="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-zinc-400">
          Don't have an account?{" "}
          <button
            onClick={() => handleNavigate("#/register")}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
