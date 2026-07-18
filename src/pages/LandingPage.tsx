import React, { useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "../context/ToastContext.js";

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isShortening, setIsShortening] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) {
      toast.error("Please enter a URL to shorten.");
      return;
    }

    setIsShortening(true);
    try {
      const data = await api.url.create({ originalUrl: longUrl });
      const fullShort = `${window.location.protocol}//${window.location.host}/${data.shortCode}`;
      setShortenedUrl(fullShort);
      toast.success("Link shortened!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Couldn't copy — try selecting it manually.");
    }
  };

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] transition-colors py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center space-y-6 pt-6 sm:pt-12 pb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 rounded-full text-xs font-semibold select-none">
          ✂️ Free link shortener
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
          Make every link <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
            count.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Turn long ugly URLs into short branded links. Add passwords, set expiry dates, and see who's clicking — all for free.
        </p>
      </div>

      {/* Shortener box */}
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-zinc-950/80 mb-16 relative z-10 hover-lift">
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Your long URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl transition-shadow"
                placeholder="Paste your long URL here..."
              />
              <button
                type="submit"
                disabled={isShortening}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
              >
                {isShortening ? "Working..." : "Shorten it"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Result */}
        {shortenedUrl && (
          <div className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl animate-scaleIn space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  ✅ Your short link is ready!
                </span>
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-bold text-indigo-700 dark:text-indigo-300 hover:underline break-all"
                >
                  {shortenedUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 rounded-xl text-gray-700 dark:text-zinc-300 shadow-sm cursor-pointer transition shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Sign-up nudge for guests */}
            {!isAuthenticated && (
              <div className="border-t border-indigo-100/50 dark:border-indigo-900/30 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-800/80 dark:text-indigo-300/80">
                <span>Want custom aliases, QR codes, and click stats?</span>
                <button
                  onClick={() => navigateTo("#/register")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Sign up free
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
          Everything you need
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover-lift transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Click analytics</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              See exactly who's clicking your links — which devices, browsers, and countries. Beautiful charts, zero setup.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover-lift transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              🔒
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Password protection</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              Lock any link with a password or set it to auto-expire. Share confidently knowing you're in control.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover-lift transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              ✏️
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Custom aliases</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              Ditch the random characters. Use memorable words like <span className="font-semibold text-gray-700 dark:text-zinc-300">/summer-sale</span> that people actually want to click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
