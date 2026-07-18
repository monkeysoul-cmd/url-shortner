import React, { useState } from "react";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";

export const UnlockPage: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getShortCode = () => {
    const hash = window.location.hash;
    const parts = hash.split("/");
    return parts[parts.length - 1] || "";
  };

  const shortCode = getShortCode();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter the password.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const data = await api.url.verifyPassword(shortCode, password);
      toast.success("Unlocked! Redirecting...");
      
      // Redirect to the target
      window.location.href = data.originalUrl;
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Wrong password. Try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/30 dark:shadow-zinc-950/40 animate-slideUp">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 rounded-2xl mb-1 select-none">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">This link is locked</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
            Enter the password for <span className="font-bold text-indigo-600 dark:text-indigo-400">/{shortCode}</span> to continue.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold animate-scaleIn">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4" id="unlock-form">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl font-semibold transition-shadow"
              placeholder="••••••••"
              id="unlock-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Unlocking...
              </>
            ) : (
              "Unlock"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              window.location.hash = "#/";
            }}
            className="text-xs font-semibold text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-1.5 mx-auto cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};
