import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  SurveyResponse,
  SummaryStats,
} from '../types/survey';
import { SURVEY_QUESTIONS, generateResponsesCSV, downloadCSVFile } from '../utils/evaluation';
import { addQuickSimulatedResponse, clearAllResponses } from '../utils/storage';
import {
  Maximize2,
  Minimize2,
  Download,
  Users,
  Award,
  Sparkles,
  RotateCcw,
  PlusCircle,
  QrCode,
  CheckCircle,
  MessageSquareQuote,
  Clock,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  responses: SurveyResponse[];
  stats: SummaryStats;
  onOpenQRModal: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  stats,
  onOpenQRModal,
  surveyUrl,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const inlineQrRef = useRef<HTMLCanvasElement>(null);

  // Handle Fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  };

  // Render small inline QR Code for the projector side-card
  useEffect(() => {
    if (inlineQrRef.current && surveyUrl) {
      QRCode.toCanvas(
        inlineQrRef.current,
        surveyUrl,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [surveyUrl]);

  const handleExportCSV = () => {
    const csv = generateResponsesCSV(responses, stats);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCSVFile(csv, `training-satisfaction-report-${dateStr}.csv`);
  };

  const handleAddSample = () => {
    addQuickSimulatedResponse();
  };

  const handleClearData = () => {
    clearAllResponses();
    setShowClearConfirm(false);
  };

  const feedbackList = responses.filter(
    (r) => r.feedback && r.feedback.trim().length > 0
  );

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] transition-colors ${
        isFullscreen
          ? 'bg-slate-950 text-white p-6 sm:p-8'
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
      }`}
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              LIVE REALTIME DASHBOARD
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            ผลการประเมินความพึงพอใจการอบรม
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ข้อมูลอัปเดตอัตโนมัติทันทีที่มีผู้ส่งแบบสอบถามผ่านโทรศัพท์มือถือ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleAddSample}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="จำลองคำตอบตัวอย่างเพื่อทดสอบกราฟ"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>+ จำลองผู้ตอบ</span>
          </button>

          <button
            onClick={onOpenQRModal}
            className="px-3 py-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code ขยายใหญ่</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>ออกจากจอใหญ่</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>จอโปรเจกเตอร์</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="รีเซ็ตล้างข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Big KPI Score Cards for Projector Legibility */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Total Respondents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">จำนวนผู้ตอบทั้งหมด</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {stats.totalResponses}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ท่าน</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>อัปเดตแบบเรียลไทม์</span>
          </div>
        </div>

        {/* Overall Mean Score (Likert Scale) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">คะแนนเฉลี่ยรวม (Mean)</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.totalResponses > 0 ? stats.overallAverage.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 5.00</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            S.D. = {stats.totalResponses > 0 ? stats.standardDeviation.toFixed(2) : '0.00'}
          </div>
        </div>

        {/* 5-Level Satisfaction Interpretation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">ระดับผลการประเมิน</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${stats.overallInterpretation.colorClass}`}>
              {stats.overallInterpretation.level}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            เกณฑ์: {stats.overallInterpretation.minScore.toFixed(2)} - {stats.overallInterpretation.maxScore.toFixed(2)}
          </div>
        </div>

        {/* High Rating Percentage (Scores 4 & 5) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">อัตราพึงพอใจสูง (ระดับ 4-5)</span>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tabular-nums text-blue-600 dark:text-blue-400">
              {stats.highRatingPercentage}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            จากคำตอบทุกข้อรวมกัน
          </div>
        </div>
      </div>

      {/* Main Grid: 5 Question Bar Charts + Right Sidefeed (Live comments + Projector QR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 5 Question Bar Charts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  ผลการประเมินแยกตามรายข้อ (สเกล 1 - 5)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ค่าเฉลี่ยและการแปลผลรายข้อ พร้อมแถบแสดงระดับความพึงพอใจ
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                เป้าหมายมาตรฐาน ≥ 3.51 (ระดับมาก)
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {SURVEY_QUESTIONS.map((q) => {
                const avg = stats.questionAverages[q.id];
                const interp = stats.questionInterpretations[q.id];
                const dist = stats.questionDistributions[q.id];
                const percentage = stats.totalResponses > 0 ? (avg / 5) * 100 : 0;

                return (
                  <div key={q.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <div className="pr-2">
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">
                          {q.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                          {q.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          {avg.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">/ 5.00</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${interp.bgClass} ${interp.colorClass}`}
                        >
                          {stats.totalResponses > 0 ? interp.level : '-'}
                        </span>
                        <button
                          onClick={() => setShowDistributionModal(q.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="ดูสัดส่วนการให้คะแนน 1-5"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 sm:h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: interp.barColor,
                        }}
                      ></div>
                    </div>

                    {/* Mini distribution count ticks */}
                    {stats.totalResponses > 0 && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                        <span>1 (น้อยที่สุด): {dist[1]} คน</span>
                        <span>2 (น้อย): {dist[2]} คน</span>
                        <span>3 (ปานกลาง): {dist[3]} คน</span>
                        <span>4 (มาก): {dist[4]} คน</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          5 (มากที่สุด): {dist[5]} คน
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 5-Level Criteria Reference Footnote */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-rose-600 dark:text-rose-400">1.00 - 1.50</span>
                <span className="block text-[10px] text-slate-500">น้อยที่สุด</span>
              </div>
              <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-orange-600 dark:text-orange-400">1.51 - 2.50</span>
                <span className="block text-[10px] text-slate-500">น้อย</span>
              </div>
              <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-amber-600 dark:text-amber-400">2.51 - 3.50</span>
                <span className="block text-[10px] text-slate-500">ปานกลาง</span>
              </div>
              <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-blue-600 dark:text-blue-400">3.51 - 4.50</span>
                <span className="block text-[10px] text-slate-500">มาก</span>
              </div>
              <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">4.51 - 5.00</span>
                <span className="block text-[10px] text-slate-500">มากที่สุด</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Feedback Stream & Embedded Projector QR Code */}
        <div className="space-y-6">
          {/* Embedded Projector QR Code Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 shadow-xs text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              สแกนทำแบบประเมินสด
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ใช้กล้องมือถือส่องเพื่อตอบทันที
            </p>

            <div className="inline-block p-2 bg-white rounded-2xl border border-slate-200 shadow-xs mb-3">
              <canvas ref={inlineQrRef} className="rounded-lg" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onOpenQRModal}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                ขยายเต็มจอ
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {surveyUrl.replace(/^https?:\/\//, '').slice(0, 24)}...
              </span>
            </div>
          </div>

          {/* Live Recent Feedback Stream */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 shadow-xs flex flex-col h-[380px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุด ({feedbackList.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">สดจากผู้เข้าอบรม</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {feedbackList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <MessageSquareQuote className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-xs">ยังไม่มีข้อเสนอแนะที่พิมพ์เข้ามา</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ข้อเสนอแนะจะปรากฏที่นี่ทันทีที่มีผู้ส่ง
                  </p>
                </div>
              ) : (
                feedbackList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    <p className="font-normal italic">&ldquo;{item.feedback}&rdquo;</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                      <span>คะแนนเฉลี่ย: {item.average.toFixed(2)} ★</span>
                      <span>{item.submittedAtFormatted || 'เมื่อสักครู่'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Modal for deep question drill-down */}
      {showDistributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            {(() => {
              const q = SURVEY_QUESTIONS.find((item) => item.id === showDistributionModal);
              if (!q) return null;
              const dist = stats.questionDistributions[q.id];
              const total = stats.totalResponses || 1;

              return (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    การกระจายตัวของคะแนน 1 ถึง 5 ดาว
                  </p>

                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((score) => {
                      const count = dist[score as 1 | 2 | 3 | 4 | 5] || 0;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={score} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {score} ดาว ({count} คน)
                            </span>
                            <span className="font-mono text-slate-500">{pct}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowDistributionModal(null)}
                    className="w-full mt-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              ยืนยันการล้างข้อมูลทั้งหมด?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              ข้อมูลแบบประเมินทั้งหมด {responses.length} รายการจะถูกรีเซ็ตเป็นศูนย์ เหมาะสำหรับใช้ก่อนเริ่มการอบรมจริง
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
