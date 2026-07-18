import React, { useState } from "react";
import { 
  Calendar, Check, Copy, Edit, ExternalLink, Lock, QrCode, Star, Trash2, 
  Eye, EyeOff, Tag, ToggleLeft, ToggleRight, X, AlertTriangle 
} from "lucide-react";
import { UrlItem } from "../types.js";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { UrlQrCode } from "./UrlQrCode.js";

interface UrlCardProps {
  url: UrlItem;
  onUpdate: () => void;
  onDelete: () => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({ url, onUpdate, onDelete }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState<boolean>(false);

  // Edit Fields State
  const [editUrl, setEditUrl] = useState<string>(url.originalUrl);
  const [editAlias, setEditAlias] = useState<string>(url.customAlias || "");
  const [editExpiry, setEditExpiry] = useState<string>(
    url.expiresAt ? new Date(url.expiresAt).toISOString().substring(0, 16) : ""
  );
  const [editPassword, setEditPassword] = useState<string>("");
  const [editTags, setEditTags] = useState<string>(url.tags.join(", "));
  const [editIsActive, setEditIsActive] = useState<boolean>(url.isActive);
  const [editIsPublic, setEditIsPublic] = useState<boolean>(url.isPublic);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const shortLink = `${window.location.protocol}//${window.location.host}/${url.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Couldn't copy — try selecting it manually.");
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.url.update(url.id, { isFavorite: !url.isFavorite });
      onUpdate();
      toast.success(url.isFavorite ? "Removed from favorites." : "Added to favorites!");
    } catch (error: any) {
      toast.error(error.message || "Couldn't update.");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUrl.trim()) {
      toast.error("URL is required.");
      return;
    }

    setIsSaving(true);
    try {
      const tagList = editTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await api.url.update(url.id, {
        originalUrl: editUrl,
        customAlias: editAlias.trim() || null,
        expiresAt: editExpiry ? new Date(editExpiry).toISOString() : null,
        password: editPassword.trim() || undefined,
        tags: tagList,
        isActive: editIsActive,
        isPublic: editIsPublic,
      });

      toast.success("Link updated!");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Couldn't save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.url.delete(url.id);
      toast.success("Link deleted.");
      onDelete();
    } catch (error: any) {
      toast.error(error.message || "Couldn't delete.");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const isExpired = url.expiresAt ? new Date(url.expiresAt).getTime() < Date.now() : false;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-md dark:hover:shadow-zinc-900/50 transition-all flex flex-col gap-4">
      {/* Standard View */}
      {!isEditing && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => window.open(shortLink, "_blank")}
                  className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 truncate max-w-full cursor-pointer font-display"
                  id={`link-short-${url.id}`}
                >
                  {shortLink}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </button>

                {/* Status badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {url.passwordHash && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900 text-[10px] font-semibold">
                      🔒 Locked
                    </span>
                  )}
                  {isExpired ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900 text-[10px] font-semibold">
                      Expired
                    </span>
                  ) : url.expiresAt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 text-[10px] font-semibold">
                      <Calendar className="w-3 h-3" /> Expires {formatDate(url.expiresAt)}
                    </span>
                  ) : null}
                  {!url.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 text-[10px] font-semibold">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-zinc-400 truncate max-w-full font-medium break-all">
                {url.originalUrl}
              </p>
            </div>

            {/* Favorite + Clicks */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  url.isFavorite
                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-500 hover:bg-amber-100"
                    : "text-gray-400 dark:text-zinc-550 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
                title={url.isFavorite ? "Remove from favorites" : "Add to favorites"}
                id={`fav-toggle-${url.id}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              <div className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-center select-none min-w-[70px]">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500">Clicks</div>
                <div className="text-sm font-bold text-gray-800 dark:text-zinc-100">{url.clicks}</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {url.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 mr-0.5" />
              {url.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-md border border-gray-100/40 dark:border-zinc-700/35"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-50 dark:border-zinc-800/80 pt-4 flex-wrap">
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium">
              Created {formatDate(url.createdAt)}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 transition-all cursor-pointer"
                id={`copy-btn-${url.id}`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQr(!showQr)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  showQr
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/35 dark:border-indigo-900 dark:text-indigo-400"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600 hover:text-gray-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-400"
                }`}
                title="QR code"
                id={`qr-btn-${url.id}`}
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Edit"
                id={`edit-btn-${url.id}`}
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDeletingConfirm(true)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-950 dark:hover:bg-rose-950/20 dark:border-zinc-800 text-gray-400 hover:border-rose-200/50 dark:hover:text-rose-400 transition-all cursor-pointer"
                title="Delete"
                id={`del-btn-${url.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QR drawer */}
          {showQr && (
            <div className="border-t border-gray-50 dark:border-zinc-800/80 pt-4 animate-fadeIn">
              <UrlQrCode shortUrl={shortLink} shortCode={url.shortCode} />
            </div>
          )}

          {/* Delete confirmation */}
          {isDeletingConfirm && (
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900 rounded-xl animate-scaleIn flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                Delete this link?
              </div>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                This will permanently delete <span className="font-semibold">/{url.shortCode}</span> and all its click data. This can't be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsDeletingConfirm(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow shadow-rose-600/10 cursor-pointer transition-all"
                  id={`confirm-del-${url.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveEdit} className="space-y-4 animate-fadeIn" id={`edit-form-${url.id}`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
            <span className="text-sm font-bold text-gray-800 dark:text-zinc-100">Edit link</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Destination URL
              </label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-shadow"
                placeholder="https://example.com/your-link"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Custom alias
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-zinc-600 text-sm font-semibold select-none">
                  /
                </span>
                <input
                  type="text"
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  className="w-full pl-6 pr-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold transition-shadow"
                  placeholder="my-link"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Expires on
              </label>
              <input
                type="datetime-local"
                value={editExpiry}
                onChange={(e) => setEditExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-shadow"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-500" /> Password
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-shadow"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Tags
              </label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-shadow"
                placeholder="marketing, social"
              />
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 py-2 border-t border-b border-gray-50 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setEditIsActive(!editIsActive)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850/50 text-left transition select-none cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-800 dark:text-zinc-200">Active</div>
                  <div className="text-[10px] text-gray-400">Enable redirects</div>
                </div>
                {editIsActive ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setEditIsPublic(!editIsPublic)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850/50 text-left transition select-none cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-800 dark:text-zinc-200">Public</div>
                  <div className="text-[10px] text-gray-400">Show analytics</div>
                </div>
                {editIsPublic ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-800 pt-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
