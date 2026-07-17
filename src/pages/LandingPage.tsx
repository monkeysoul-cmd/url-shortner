import React, { useState } from "react";
import { 
  BarChart3, Check, Clipboard, Copy, Link2, Lock, 
  PlusCircle, ShieldCheck, Sparkles, Zap, ArrowRight, Star
} from "lucide-react";
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
      toast.error("Please enter a valid URL to shorten.");
      return;
    }

    setIsShortening(true);
    try {
      const data = await api.url.create({ originalUrl: longUrl });
      const fullShort = `${window.location.protocol}//${window.location.host}/${data.shortCode}`;
      setShortenedUrl(fullShort);
      toast.success("URL successfully shortened!");
    } catch (error: any) {
      toast.error(error.message || "Failed to shorten URL.");
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success("Short URL copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 min-h-[calc(100vh-4rem)] transition-colors py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Header Area */}
      <div className="max-w-4xl mx-auto text-center space-y-6 pt-6 sm:pt-12 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 rounded-full text-xs font-semibold uppercase tracking-wider select-none">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Link Manager
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
          Shorten. Brand. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
            Track Everything.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-500 dark:text-zinc-450 max-w-xl mx-auto leading-relaxed">
          The professional link cutter to brand your custom alias, set expirations, lock with passwords, generate dynamic QR codes, and trace device-specific analytics.
        </p>
      </div>

      {/* Main Shortener console box */}
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850/80 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-zinc-950/80 mb-16 relative overflow-hidden">
        <form onSubmit={handleShorten} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Paste your long destination URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl"
                placeholder="https://very-long-destination-url.com/some/extra/path-to-compress"
              />
              <button
                type="submit"
                disabled={isShortening}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                {isShortening ? "Generating..." : "Shorten"}
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Shortened URL display card */}
        {shortenedUrl && (
          <div className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl animate-scaleIn space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Ready Short Link
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

            {/* Guest Promo Banner Overlay */}
            {!isAuthenticated && (
              <div className="border-t border-indigo-100/50 dark:border-indigo-900/30 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-800/80 dark:text-indigo-300/80">
                <span>Want custom aliases, QR downloads, password protection, and click charts?</span>
                <button
                  onClick={() => navigateTo("#/register")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Sign Up Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Features Highlights Section */}
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
          Engineered for Advanced Link Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850/80 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Granular Click Logs</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-450 leading-relaxed">
              Analyze click occurrences by devices, browser software, and geographical country tags on interactive graphs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850/80 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Protected & Public Links</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-450 leading-relaxed">
              Restrict links with hashed password protection or set expiration date calendars to safely manage content pipelines.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850/80 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Branded Custom Aliases</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-450 leading-relaxed">
              Replace standard random short codes with custom branded words to improve audience engagement rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
