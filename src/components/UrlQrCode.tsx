import React, { useState } from "react";
import { Download, Loader2, QrCode } from "lucide-react";
import { useToast } from "../context/ToastContext.js";

interface UrlQrCodeProps {
  shortUrl: string;
  shortCode: string;
}

export const UrlQrCode: React.FC<UrlQrCodeProps> = ({ shortUrl, shortCode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`;

  const handleDownload = async () => {
    try {
      toast.info("Preparing QR Code for download...");
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("QR Code downloaded successfully!");
    } catch (error) {
      console.error("QR Download error:", error);
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm text-center">
      <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-zinc-100 text-sm">
        <QrCode className="w-5 h-5 text-indigo-500" />
        QR Code Scanner Link
      </div>
      
      <div className="relative w-44 h-44 flex items-center justify-center border border-gray-150 dark:border-zinc-800 p-2 rounded-xl bg-gray-50 dark:bg-zinc-950 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 z-10">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        )}
        <img
          src={qrUrl}
          alt={`QR Code for ${shortUrl}`}
          className="w-full h-full object-contain"
          onLoad={() => setIsLoading(false)}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-zinc-400 break-all px-2 max-w-[200px]">
        {shortUrl}
      </div>

      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-medium text-xs rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Download PNG
      </button>
    </div>
  );
};
