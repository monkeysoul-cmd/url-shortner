import React, { useState } from "react";
import { Link2, Loader2, UserPlus, Mail, ShieldAlert, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "../context/ToastContext.js";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register(name.trim(), email.trim(), password);
      toast.success("Account successfully created! Welcome aboard.");
      window.location.hash = "#/dashboard";
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to register account.";
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
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-2">
            <Link2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Create your account</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Sign up to access custom aliases, password protection, and click statistics.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 mb-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 font-medium animate-scaleIn">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-gray-400 dark:text-zinc-500 w-4 h-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
                placeholder="Jane Doe"
                id="register-name"
              />
            </div>
          </div>

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
                id="register-email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
              placeholder="•••••••• (min 6 characters)"
              id="register-password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider block">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
              placeholder="••••••••"
              id="register-confirm-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
            id="register-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Sign Up Free
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-zinc-440">
          Already have an account?{" "}
          <button
            onClick={() => handleNavigate("#/login")}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Log in instead
          </button>
        </div>
      </div>
    </div>
  );
};
