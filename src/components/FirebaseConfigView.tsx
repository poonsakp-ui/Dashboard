import React, { useState } from 'react';
import { Database, CheckCircle2, ShieldCheck, Zap, RefreshCw, Key, HelpCircle } from 'lucide-react';

interface FirebaseConfigViewProps {
  onSaveConfig: (config: { databaseURL: string; apiKey?: string; projectId?: string }) => void;
  currentDatabaseURL: string;
  isFirebaseActive: boolean;
  setIsFirebaseActive: (active: boolean) => void;
}

export const FirebaseConfigView: React.FC<FirebaseConfigViewProps> = ({
  onSaveConfig,
  currentDatabaseURL,
  isFirebaseActive,
  setIsFirebaseActive,
}) => {
  const [dbUrl, setDbUrl] = useState(currentDatabaseURL || '');
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl.trim()) {
      setStatusMessage('กรุณาระบุ Firebase Database URL เช่น https://my-app-default-rtdb.asia-southeast1.firebasedatabase.app');
      return;
    }
    onSaveConfig({
      databaseURL: dbUrl.trim(),
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
    });
    setIsFirebaseActive(true);
    setStatusMessage('บันทึกการตั้งค่า Firebase สำเร็จ ระบบจะเชื่อมต่อกับฐานข้อมูลคลาวด์');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              การเชื่อมต่อ Firebase Realtime Database
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              เลือกระหว่างโหมด Broadcast Sync ภายในเบราว์เซอร์ หรือเชื่อมต่อคลาวด์ Firebase จริง
            </p>
          </div>
        </div>

        {/* Mode Selector Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            onClick={() => setIsFirebaseActive(false)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              !isFirebaseActive
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                โหมดแนะนำสำหรับการสาธิต
              </span>
              {!isFirebaseActive && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Local Broadcast Sync (พร้อมใช้งานทันที)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ซิงก์ข้อมูลเรียลไทม์ระหว่างหน้าจอแบบสอบถามและหน้าจอ Dashboard ข้ามแท็บหรือข้ามหน้าต่างได้ทันทีโดยไม่ต้องใส่ API Key
            </p>
          </div>

          <div
            onClick={() => setIsFirebaseActive(true)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              isFirebaseActive
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                เชื่อมต่อคลาวด์จริง
              </span>
              {isFirebaseActive && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Firebase Realtime Database (Live Cloud)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              เชื่อมโยงฐานข้อมูลคลาวด์ของ Google ข้ามอุปกรณ์ได้ทั่วโลก ผู้เข้าอบรมทุกคนใช้อินเทอร์เน็ตคนละเครือข่ายก็เห็นผลพร้อมกัน
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Firebase Realtime Database URL *</span>
            </label>
            <input
              type="text"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              placeholder="https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              นำมาจาก Firebase Console &gt; Realtime Database (ด้านบนของแท็บ Data)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>API Key (ไม่บังคับสำหรับ Test mode)</span>
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Project ID (ไม่บังคับ)</span>
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="training-feedback-app"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>บันทึกการตั้งค่า Firebase</span>
            </button>
          </div>
        </form>

        {/* Security Rule Explainer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>ข้อแนะนำด้านความปลอดภัย:</strong> หากต้องการเปิดให้ผู้ตอบแบบสอบถามส่งข้อมูลได้โดยไม่ต้องมีบัญชีผู้ใช้ Firebase ให้ตรวจสอบว่าได้ใส่ Rules ใน Realtime Database ตามคู่มือในแท็บ &ldquo;ดาวน์โหลดโค้ด 2 ไฟล์ &amp; วิธี Deploy&rdquo; เรียบร้อยแล้ว
          </div>
        </div>
      </div>
    </div>
  );
};
