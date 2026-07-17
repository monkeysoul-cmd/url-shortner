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
      toast.success("Short link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.url.update(url.id, { isFavorite: !url.isFavorite });
      onUpdate();
      toast.success(url.isFavorite ? "Removed from favorites." : "Added to favorites!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update favorite status.");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUrl.trim()) {
      toast.error("Original URL is required");
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

      toast.success("URL successfully updated!");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to update shortened URL.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.url.delete(url.id);
      toast.success("Short URL successfully deleted.");
      onDelete();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete URL.");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const isExpired = url.expiresAt ? new Date(url.expiresAt).getTime() < Date.now() : false;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-md dark:hover:shadow-zinc-900/50 transition-all flex flex-col gap-4">
      {/* Standard Card Mode */}
      {!isEditing && (
        <>
          <div className="flex items-start justify-between gap-4">
            {/* Title / Links Info */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => window.open(shortLink, "_blank")}
                  className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate max-w-full cursor-pointer font-display"
                  id={`link-short-${url.id}`}
                >
                  {shortLink}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </button>

                {/* Expiry / Lock Status Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {url.passwordHash && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900 text-[10px] font-semibold">
                      <Lock className="w-3 h-3" /> Hashed Pass
                    </span>
                  )}
                  {isExpired ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900 text-[10px] font-semibold">
                      Expired
                    </span>
                  ) : url.expiresAt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 text-[10px] font-semibold">
                      <Calendar className="w-3 h-3" /> Exp: {formatDate(url.expiresAt)}
                    </span>
                  ) : null}
                  {!url.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 text-[10px] font-semibold">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Original Long URL */}
              <p className="text-sm text-gray-500 dark:text-zinc-400 truncate max-w-full font-medium break-all">
                {url.originalUrl}
              </p>
            </div>

            {/* Quick Star Favorite & Clicks Indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  url.isFavorite
                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-500 hover:bg-amber-100"
                    : "text-gray-400 dark:text-zinc-550 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
                title={url.isFavorite ? "Remove Favorite" : "Add to Favorites"}
                id={`fav-toggle-${url.id}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              <div className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850/80 rounded-xl text-center select-none min-w-[70px]">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500">Clicks</div>
                <div className="text-sm font-bold text-gray-800 dark:text-zinc-100">{url.clicks}</div>
              </div>
            </div>
          </div>

          {/* Tags Drawer */}
          {url.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 mr-0.5" />
              {url.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-md border border-gray-150/40 dark:border-zinc-700/35"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Card Bar Controls */}
          <div className="flex items-center justify-between gap-4 border-t border-gray-50 dark:border-zinc-800/80 pt-4 flex-wrap">
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium">
              Created on {formatDate(url.createdAt)}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Copy Short Link */}
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

              {/* Show QR Scanner */}
              <button
                onClick={() => setShowQr(!showQr)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  showQr
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/35 dark:border-blue-900 text-blue-400"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-150 text-gray-600 hover:text-gray-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-400"
                }`}
                title="Toggle QR Code scanner Link"
                id={`qr-btn-${url.id}`}
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Edit Details */}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Edit link parameters"
                id={`edit-btn-${url.id}`}
              >
                <Edit className="w-4 h-4" />
              </button>

              {/* Delete trigger */}
              <button
                onClick={() => setIsDeletingConfirm(true)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-950 dark:hover:bg-rose-950/20 dark:border-zinc-800 text-gray-400 hover:border-rose-200/50 dark:hover:text-rose-400 transition-all cursor-pointer"
                title="Delete short link"
                id={`del-btn-${url.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded QR Drawer */}
          {showQr && (
            <div className="border-t border-gray-50 dark:border-zinc-800/80 pt-4 animate-fadeIn">
              <UrlQrCode shortUrl={shortLink} shortCode={url.shortCode} />
            </div>
          )}

          {/* Delete Confirmation Overlay Sheet */}
          {isDeletingConfirm && (
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900 rounded-xl animate-scaleIn flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                Confirm Link Deletion
              </div>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                Are you absolutely sure you want to delete <span className="font-semibold">/{url.shortCode}</span>? All statistics, analytics, and QR scans will be permanently destroyed. This cannot be undone.
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
                  Delete Permanently
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Form Mode */}
      {isEditing && (
        <form onSubmit={handleSaveEdit} className="space-y-4 animate-fadeIn" id={`edit-form-${url.id}`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-2">
            <span className="text-sm font-bold text-gray-800 dark:text-zinc-100">Edit Shortened URL details</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original URL */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                Original URL
              </label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="https://example.com/very-long-link"
              />
            </div>

            {/* Custom Alias */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                Custom Alias / Short Code
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-zinc-600 text-sm font-semibold select-none">
                  /
                </span>
                <input
                  type="text"
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  className="w-full pl-6 pr-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-semibold"
                  placeholder="custom-name"
                />
              </div>
            </div>

            {/* Expiration Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                value={editExpiry}
                onChange={(e) => setEditExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* Update Link Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-500" /> Lock Password
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="Leave blank to keep current"
              />
            </div>

            {/* Tags comma separated */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-transparent dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="marketing, social-media, work"
              />
            </div>

            {/* Status Toggles */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 py-2 border-t border-b border-gray-50 dark:border-zinc-850">
              <button
                type="button"
                onClick={() => setEditIsActive(!editIsActive)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850/50 text-left transition select-none cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-800 dark:text-zinc-200">Active Link</div>
                  <div className="text-[10px] text-gray-400">Enable/disable redirect</div>
                </div>
                {editIsActive ? (
                  <ToggleRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                  <div className="text-xs font-bold text-gray-800 dark:text-zinc-200">Public Link</div>
                  <div className="text-[10px] text-gray-400">Allow analytics viewing</div>
                </div>
                {editIsPublic ? (
                  <ToggleRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Save / Cancel controls */}
          <div className="flex gap-2 justify-end border-t border-gray-100 dark:border-zinc-850 pt-3">
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
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-xl cursor-pointer flex items-center gap-1.5 transition"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
