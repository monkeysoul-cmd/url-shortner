import React, { useState } from "react";
import { Loader2, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
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
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register(name.trim(), email.trim(), password);
      toast.success("Account created! Welcome aboard 🎉");
      window.location.hash = "#/dashboard";
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Something went wrong.";
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
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-600/12 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '6s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[150px]" />

      {/* Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 animate-slideUp relative z-10">
        {/* Gradient top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 rounded-full" />

        {/* Header */}
        <div className="text-center space-y-3 mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 text-white text-3xl shadow-lg shadow-pink-600/20 mb-2">
            ✂️
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Create your account</h2>
          <p className="text-sm text-zinc-400">
            Free forever. No credit card needed.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-3.5 mb-5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 font-medium animate-scaleIn">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-400" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="Jane Doe"
              id="register-name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="you@example.com"
              id="register-email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="At least 6 characters"
              id="register-password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input text-sm text-zinc-100 rounded-xl font-medium placeholder-zinc-600 focus:outline-none"
              placeholder="••••••••"
              id="register-confirm-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-violet-600 to-indigo-600 hover:from-pink-400 hover:via-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer flex items-center justify-center gap-2"
            id="register-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <button
            onClick={() => handleNavigate("#/login")}
            className="font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};
