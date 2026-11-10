import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, Check, X, Smartphone, ExternalLink } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [targetUrl, setTargetUrl] = useState(surveyUrl);

  useEffect(() => {
    setTargetUrl(surveyUrl);
  }, [surveyUrl]);

  useEffect(() => {
    if (isOpen && canvasRef.current && targetUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        targetUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-survey-qr.png';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            สแกน QR Code เพื่อทำแบบประเมิน
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            เปิดกล้องโทรศัพท์มือถือแล้วส่องที่รูป QR เพื่อเข้าสู่หน้าตอบแบบประเมินทันที
          </p>
        </div>

        {/* QR Canvas */}
        <div className="flex justify-center my-4">
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xs">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
        </div>

        {/* Link Input & Copy */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            ลิงก์ตรงสำหรับส่งให้ผู้เข้าอบรม:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-2.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดภาพ QR Code</span>
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>เปิดทดสอบ</span>
          </a>
        </div>
      </div>
    </div>
  );
};
