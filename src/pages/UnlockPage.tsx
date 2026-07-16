import React, { useState } from "react";
import { Lock, Loader2, KeyRound, ArrowLeft, AlertCircle } from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";

export const UnlockPage: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extract short code from hash URL like #/unlock/code
  const getShortCode = () => {
    const hash = window.location.hash;
    const parts = hash.split("/");
    return parts[parts.length - 1] || "";
  };

  const shortCode = getShortCode();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Password is required.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const data = await api.url.verifyPassword(shortCode, password);
      toast.success("Security verified! Redirecting...");
      
      // Perform the redirect to the target original URL
      window.location.href = data.originalUrl;
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Incorrect link password. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-250/20 dark:shadow-[#09090b]/40">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 rounded-2xl mb-1 select-none animate-bounce">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">Protected Link Access</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
            The link <span className="font-bold text-blue-600 dark:text-blue-400">/{shortCode}</span> requires password authentication before redirecting.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold animate-scaleIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4" id="unlock-form">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Enter Passkey
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-gray-400 dark:text-zinc-500 w-4.5 h-4.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:text-zinc-100 rounded-xl font-semibold"
                placeholder="••••••••"
                id="unlock-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Unlocking link...
              </>
            ) : (
              <>
                <span>Verify & Redirect</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              window.location.hash = "#/";
            }}
            className="text-xs font-semibold text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
