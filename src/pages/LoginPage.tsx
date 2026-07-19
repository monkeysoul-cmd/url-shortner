import React, { useState } from "react";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
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
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      toast.success("Welcome back!");
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
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#060612]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[150px]" />

      {/* Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 animate-slideUp relative z-10">
        {/* Gradient top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] accent-gradient rounded-full" />

        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl accent-gradient text-white text-3xl shadow-lg shadow-violet-600/25 mb-2">
            ✂️
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Welcome back</h2>
          <p className="text-sm text-zinc-400">
            Sign in to manage your links.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-3.5 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 font-medium animate-scaleIn">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="you@example.com"
              id="login-email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="••••••••"
              id="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 btn-gradient disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer flex items-center justify-center gap-2"
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-7 text-sm text-zinc-500">
          Don't have an account?{" "}
          <button
            onClick={() => handleNavigate("#/register")}
            className="font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};
