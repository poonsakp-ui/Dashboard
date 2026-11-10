import React from 'react';
import { Smartphone, MonitorPlay, FileCode, QrCode, Sun, Moon, Database } from 'lucide-react';

export type ActiveTab = 'survey' | 'dashboard' | 'code-guide' | 'firebase-config';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQRModal: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  isFirebaseConnected: boolean;
  totalResponses: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQRModal,
  isDark,
  toggleDarkMode,
  isFirebaseConnected,
  totalResponses,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            E
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap block">
              Live Evaluation
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden sm:block">
              ระบบประเมินความพึงพอใจการอบรม
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean buttons) */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'survey'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าแบบสอบถาม (ผู้ตอบ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Dashboard สด (จอโปรเจกเตอร์)</span>
            {totalResponses > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-mono tabular-nums">
                {totalResponses}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('code-guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'code-guide'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดโค้ด 2 ไฟล์ & วิธี Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase-config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'firebase-config'
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>เชื่อมต่อ Firebase</span>
            {isFirebaseConnected ? (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● ต่อแล้ว</span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">● โลคอลซิงก์</span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action + Dark Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenQRModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">เปิด QR Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
