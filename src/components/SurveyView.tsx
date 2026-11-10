import React, { useState, useEffect } from 'react';
import { SURVEY_QUESTIONS, RATING_LEVELS, interpretScore } from '../utils/evaluation';
import { saveResponse, checkHasSubmitted, clearSubmissionLock } from '../utils/storage';
import { CheckCircle2, RotateCcw, Send, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';

interface SurveyViewProps {
  onSubmittedSuccess?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmittedSuccess }) => {
  const [answers, setAnswers] = useState<{ q1: number; q2: number; q3: number; q4: number; q5: number }>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadySubmittedInfo, setAlreadySubmittedInfo] = useState<{
    submittedAt: string;
    average: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    const status = checkHasSubmitted();
    if (status.hasSubmitted && status.info) {
      setAlreadySubmittedInfo(status.info);
    }
  }, []);

  const handleSelectScore = (questionId: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all 5 questions
    const unansweredIndex = [1, 2, 3, 4, 5].find((i) => {
      const key = `q${i}` as keyof typeof answers;
      return !answers[key] || answers[key] < 1;
    });

    if (unansweredIndex) {
      setErrorMessage(`กรุณาประเมินข้อที่ ${unansweredIndex} ให้ครบถ้วนก่อนส่ง`);
      const el = document.getElementById(`question-card-q${unansweredIndex}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = saveResponse({
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        feedback: feedback.trim(),
        deviceId: 'device-' + (Math.random().toString(36).substring(2, 8)),
      });

      setAlreadySubmittedInfo({
        submittedAt: saved.timestamp,
        average: saved.average,
        feedback: saved.feedback || '',
      });

      if (onSubmittedSuccess) {
        onSubmittedSuccess();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    clearSubmissionLock();
    setAlreadySubmittedInfo(null);
    setAnswers({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setFeedback('');
    setErrorMessage(null);
  };

  // Already submitted screen (Anti-duplicate prevention)
  if (alreadySubmittedInfo) {
    const interpretation = interpretScore(alreadySubmittedInfo.average);
    return (
      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            บันทึกแบบประเมินเรียบร้อยแล้ว
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            ขอบคุณสำหรับความคิดเห็นอันมีค่ายิ่ง ข้อมูลของท่านถูกส่งต่อไปยังหน้า Dashboard ของผู้จัดอบรมแบบสดๆ ทันที
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 text-left border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">สถานะการส่ง</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                ส่งสำเร็จ (ป้องกันการตอบซ้ำ)
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                คะแนนเฉลี่ยที่คุณประเมิน:
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                {alreadySubmittedInfo.average.toFixed(2)} / 5.00
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">ระดับความพึงพอใจ:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${interpretation.bgClass} ${interpretation.colorClass}`}>
                {interpretation.level}
              </span>
            </div>

            {alreadySubmittedInfo.feedback && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  ข้อเสนอแนะที่ส่ง:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  &ldquo;{alreadySubmittedInfo.feedback}&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleResetForTesting}
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทดสอบส่งใหม่อีกครั้ง (สำหรับผู้จัดทดสอบระบบ)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = [answers.q1, answers.q2, answers.q3, answers.q4, answers.q5].filter(
    (s) => s > 0
  ).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แบบประเมินผู้เข้าอบรม (ไม่ระบุตัวตน)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            แบบประเมินความพึงพอใจการอบรม
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            กรุณาให้คะแนนความพึงพอใจใน 5 ด้านสำคัญ เพื่อนำผลการประเมินไปพัฒนาและปรับปรุงคุณภาพการอบรมในครั้งถัดไป
          </p>

          {/* Progress indicator */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-300">ความคืบหน้าในการตอบ:</span>
            <span className="font-mono font-bold text-blue-300 tabular-nums">
              {answeredCount} / 5 ข้อ
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Error alert if validation fails */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Survey Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {SURVEY_QUESTIONS.map((q, idx) => {
          const selectedValue = answers[q.id];
          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border transition-all p-5 sm:p-6 shadow-xs ${
                selectedValue > 0
                  ? 'border-blue-200 dark:border-blue-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {q.category}
                </span>
                {selectedValue > 0 && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ตอบแล้ว: {selectedValue} คะแนน</span>
                  </span>
                )}
              </div>

              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                {q.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {q.description}
              </p>

              {/* 1-5 Big Touch Buttons (Mobile First, Touch Hitbox >= 48px) */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                {RATING_LEVELS.slice().reverse().map((level) => {
                  const isSelected = selectedValue === level.score;
                  return (
                    <button
                      type="button"
                      key={level.score}
                      onClick={() => handleSelectScore(q.id, level.score)}
                      className={`min-h-[58px] sm:min-h-[68px] flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-lg sm:text-xl leading-none mb-1">
                        {level.emoji}
                      </span>
                      <span className="text-base sm:text-lg font-bold font-mono tabular-nums leading-none">
                        {level.score}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] mt-1 text-center font-medium whitespace-nowrap truncate w-full ${
                          isSelected ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {level.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Optional Recommendations / Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            สิ่งที่ท่านประทับใจ หรือสิ่งที่ต้องการให้ปรับปรุงเพิ่มเติมในหลักสูตรถัดไป
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะเพิ่มเติมที่นี่..."
            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        </div>

        {/* Submit Button (Sticky on mobile or prominent at bottom) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-semibold text-base text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              answeredCount === 5
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 cursor-pointer'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {isSubmitting ? (
              <span>กำลังบันทึกข้อมูล...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {answeredCount === 5
                    ? 'ส่งแบบประเมินความพึงพอใจ'
                    : `กรุณาตอบให้ครบ (${answeredCount}/5 ข้อ)`}
                </span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            ข้อมูลของคุณจะถูกรวมเข้ากับผลลัพธ์บนหน้าจอแบบเรียลไทม์โดยอัตโนมัติ
          </p>
        </div>
      </form>
    </div>
  );
};
