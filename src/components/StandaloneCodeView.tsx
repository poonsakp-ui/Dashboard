import React, { useState } from 'react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
  DEPLOYMENT_GUIDE_MARKDOWN,
} from '../templates/standaloneFiles';
import {
  FileCode,
  Download,
  Copy,
  Check,
  BookOpen,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export const StandaloneCodeView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySurvey = async () => {
    try {
      await navigator.clipboard.writeText(STANDALONE_SURVEY_HTML);
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyDashboard = async () => {
    try {
      await navigator.clipboard.writeText(STANDALONE_DASHBOARD_HTML);
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-blue-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>โค้ด 2 ไฟล์พร้อมใช้งาน (Zero-Build Vanilla HTML + JS)</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">
          ไฟล์โค้ดสำเร็จรูปแยก 2 หน้า & คู่มือ Deploy
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          ตามที่คุณขอ: โค้ดถูกเขียนแยกเป็น 2 ไฟล์อิสระ คือ <strong>survey.html</strong> (สำหรับผู้เข้าอบรมตอบผ่านมือถือ) และ <strong>dashboard.html</strong> (สำหรับผู้จัดอบรมขึ้นจอโปรเจกเตอร์) ใช้ Firebase Realtime Database สามารถดาวน์โหลดไปเปิดใช้งานหรือ Deploy ได้ทันทีโดยไม่ต้องรัน Node.js หรือคอมไพล์!
        </p>

        {/* Quick Download Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3">
          <button
            onClick={() => downloadFile(STANDALONE_SURVEY_HTML, 'survey.html')}
            className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => downloadFile(STANDALONE_DASHBOARD_HTML, 'dashboard.html')}
            className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด dashboard.html (หน้าแดชบอร์ด)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('survey')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
            activeSubTab === 'survey'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>1. survey.html (หน้าตอบแบบสอบถาม)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
            activeSubTab === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>2. dashboard.html (หน้า Dashboard จอโปรเจกเตอร์)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
            activeSubTab === 'guide'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. คู่มือตั้งค่า Firebase & Deploy ทีละขั้น</span>
        </button>
      </div>

      {/* Survey Tab Content */}
      {activeSubTab === 'survey' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>survey.html</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ไฟล์ HTML + CSS + JS เดี่ยว สำหรับให้ผู้เข้าอบรมสแกนเปิดผ่านมือถือ มีสเกล 1-5 และล็อกกันการตอบซ้ำ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySurvey}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {copiedSurvey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSurvey ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ด'}</span>
              </button>
              <button
                onClick={() => downloadFile(STANDALONE_SURVEY_HTML, 'survey.html')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto max-h-[550px] scrollbar-thin">
              <code>{STANDALONE_SURVEY_HTML}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Dashboard Tab Content */}
      {activeSubTab === 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-500" />
                <span>dashboard.html</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ไฟล์ HTML + JS สำหรับเปิดบนจอโปรเจกเตอร์ มีตัวฟัง Realtime Database สด พร้อมปุ่ม Fullscreen, QR Code และ Export CSV
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDashboard}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {copiedDashboard ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDashboard ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ด'}</span>
              </button>
              <button
                onClick={() => downloadFile(STANDALONE_DASHBOARD_HTML, 'dashboard.html')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto max-h-[550px] scrollbar-thin">
              <code>{STANDALONE_DASHBOARD_HTML}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Guide Tab Content */}
      {activeSubTab === 'guide' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                คู่มือการตั้งค่า Firebase Realtime Database และ Deploy ทีละขั้นตอน
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ทำตาม 5 ขั้นตอนนี้เพื่อเปิดใช้งานระบบออนไลน์จริงฟรี 100% ไม่ต้องใช้บัตรเครดิต
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  สร้าง Firebase Project ฟรี (Spark Plan)
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>ไปที่เว็บไซต์ <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">Firebase Console</a> และล็อกอินด้วย Google Account</li>
                <li>คลิก <strong>&quot;Add project&quot; (เพิ่มโครงการ)</strong></li>
                <li>ตั้งชื่อโครงการ เช่น <code>training-feedback-app</code> แล้วคลิก Continue</li>
                <li>หน้า Google Analytics สามารถเลือกปิดไว้ได้ (ไม่จำเป็นต้องใช้) แล้วคลิก <strong>Create project</strong></li>
                <li>รอสร้างโครงการประมาณ 10-15 วินาที แล้วคลิก Continue</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  เปิดใช้งาน Firebase Realtime Database
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>ที่เมนูด้านซ้าย เลือก <strong>Build</strong> &gt; คลิก <strong>Realtime Database</strong></li>
                <li>คลิกปุ่ม <strong>&quot;Create Database&quot;</strong></li>
                <li>เลือก Location แนะนำเป็น <code>Singapore (asia-southeast1)</code> เพื่อความเร็วสูงสุดในไทย</li>
                <li>ในหัวข้อ Security Rules ให้เลือก <strong>&quot;Start in test mode&quot;</strong> แล้วกด Enable</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  ตั้งค่า Security Rules เพื่อความปลอดภัย
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                ไปที่แท็บ <strong>Rules</strong> ของ Realtime Database แล้วคัดลอกโค้ดนี้ไปวาง จากนั้นคลิก <strong>Publish</strong>:
              </p>
              <pre className="p-3 bg-slate-950 text-blue-300 rounded-xl text-xs font-mono overflow-x-auto">
{`{
  "rules": {
    "training_responses": {
      ".read": true,
      "$resp_id": {
        ".write": true,
        ".validate": "newData.hasChildren(['q1','q2','q3','q4','q5','timestamp']) &&
                      newData.child('q1').isNumber() && newData.child('q1').val() >= 1 && newData.child('q1').val() <= 5 &&
                      newData.child('q2').isNumber() && newData.child('q2').val() >= 1 && newData.child('q2').val() <= 5 &&
                      newData.child('q3').isNumber() && newData.child('q3').val() >= 1 && newData.child('q3').val() <= 5 &&
                      newData.child('q4').isNumber() && newData.child('q4').val() >= 1 && newData.child('q4').val() <= 5 &&
                      newData.child('q5').isNumber() && newData.child('q5').val() >= 1 && newData.child('q5').val() <= 5"
      }
    }
  }
}`}
              </pre>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  นำ Firebase Config มาใส่ในโค้ด
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>ไปที่ไอคอนฟันเฟือง ⚙️ ด้านบนซ้าย &gt; คลิก <strong>Project settings</strong></li>
                <li>เลื่อนลงมาหัวข้อ <strong>Your apps</strong> &gt; คลิกไอคอนเว็บ <strong>&lt;/&gt;</strong></li>
                <li>ตั้งชื่อเล่นให้แอป เช่น <code>training-app</code> แล้วกด Register app</li>
                <li>คัดลอกบล็อก <code>const firebaseConfig = &#123; ... &#125;;</code></li>
                <li>เปิดไฟล์ <code>survey.html</code> และ <code>dashboard.html</code> แล้วนำค่าดังกล่าวไปแทนที่</li>
              </ul>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  5
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  วิธี Deploy ออนไลน์ฟรี (3 ช่องทางแนะนำ)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">
                    ช่องทาง 1: Netlify Drop (ลากวาง 5 วิ)
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    สร้างโฟลเดอร์ วาง survey.html และ dashboard.html เข้า <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">app.netlify.com/drop</a> แล้วลากวาง จะได้ลิงก์ HTTPS ใช้ได้ทันที
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    ช่องทาง 2: GitHub Pages (ฟรีตลอดชีพ)
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    สร้าง Repo ใหม่ใน GitHub อัปโหลดทั้ง 2 ไฟล์ จากนั้นเปิด Settings &gt; Pages &gt; เลือก Branch main แล้ว Save
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1">
                    ช่องทาง 3: Firebase Hosting
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    รันคำสั่ง <code>firebase init hosting</code> แล้วสั่ง <code>firebase deploy</code> รวมฐานข้อมูลและเว็บไว้ในโปรเจกต์เดียวกันอย่างลงตัว
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
