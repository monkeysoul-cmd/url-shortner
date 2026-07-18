import React, { useState } from "react";
import { 
  Calendar, Check, Copy, Lock, PlusCircle, 
  QrCode, Tag 
} from "lucide-react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { UrlQrCode } from "../components/UrlQrCode.js";

export const CreateUrlPage: React.FC = () => {
  const { toast } = useToast();
  
  // Form Fields
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Success State
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      toast.error("Please paste a URL first.");
      return;
    }

    setIsSubmitting(true);
    setCreatedUrl(null);
    setCreatedCode(null);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await api.url.create({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        password: password.trim() || undefined,
        tags,
        isPublic,
        isFavorite,
      });

      const fullShortUrl = `${window.location.protocol}//${window.location.host}/${res.shortCode}`;
      setCreatedUrl(fullShortUrl);
      setCreatedCode(res.shortCode);
      toast.success("Link created!");
      
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      setPassword("");
      setTagsInput("");
      setIsFavorite(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Couldn't copy — try selecting it manually.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#09090b] text-gray-800 dark:text-zinc-200 transition-colors min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display" id="create-url-title">
          Shorten a link
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Paste any URL, customize it, and get a short link you can share anywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" id="create-url-form">
            {/* Long URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                Long URL *
              </label>
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl font-medium transition-shadow"
                placeholder="https://example.com/your-really-long-url"
                id="create-url-original"
              />
            </div>

            {/* Custom back-half */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                ✏️ Custom back-half <span className="text-gray-400 dark:text-zinc-500 normal-case">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400 dark:text-zinc-600 text-sm font-semibold select-none">
                  linkcut.com /
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full pl-[108px] pr-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl font-semibold transition-shadow"
                  placeholder="summer-sale"
                  id="create-url-alias"
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                Pick something short and memorable.
              </p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Expiry */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Expires on <span className="text-gray-400 dark:text-zinc-500 normal-case">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl transition-shadow"
                  id="create-url-expiry"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" /> Password protect <span className="text-gray-400 dark:text-zinc-500 normal-case">(optional)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl transition-shadow"
                  placeholder="••••••••"
                  id="create-url-password"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> Tags <span className="text-gray-400 dark:text-zinc-500 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-sm border border-gray-150 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 rounded-xl transition-shadow"
                  placeholder="newsletter, pricing, q3"
                  id="create-url-tags"
                />
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium leading-tight">
                  Separate with commas to organize your links.
                </p>
              </div>

              {/* Settings */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Options
                </label>
                <div className="flex gap-4 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-800 h-[46px] items-center">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                    />
                    Public stats
                  </label>
                  
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-300 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                    />
                    Favorite
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-1.5"
              id="create-url-submit"
            >
              {isSubmitting ? "Creating..." : "Shorten URL"}
            </button>
          </form>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {createdUrl && createdCode ? (
            <div className="animate-scaleIn space-y-4">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/60 p-4 rounded-2xl flex flex-col gap-3">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  🎉 Link created!
                </div>
                
                <div className="space-y-1.5 min-w-0">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all block"
                  >
                    {createdUrl}
                  </a>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 text-xs text-gray-700 dark:text-zinc-300 font-semibold rounded-xl cursor-pointer transition shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800/85"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-500" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code */}
              <UrlQrCode shortUrl={createdUrl} shortCode={createdCode} />
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-center shadow-sm space-y-4">
              <div className="text-4xl animate-float">✂️</div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-800 dark:text-zinc-200 font-display">Ready to shorten</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[200px] mx-auto leading-relaxed">
                  Paste a URL and hit shorten — your QR code will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
