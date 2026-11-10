import { QuestionDefinition, RatingInterpretation, SummaryStats, SurveyResponse } from '../types/survey';

export const SURVEY_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'q1',
    category: 'ด้านเนื้อหาหลักสูตร',
    title: '1. เนื้อหาหลักสูตรมีความน่าสนใจ เป็นประโยชน์ และตรงตามความต้องการ',
    description: 'ความทันสมัย ความครบถ้วน และการนำไปประยุกต์ใช้งานได้จริง',
  },
  {
    id: 'q2',
    category: 'ด้านวิทยากร',
    title: '2. วิทยากรมีความรู้ความเชี่ยวชาญ ถ่ายทอดเข้าใจง่าย และตอบข้อซักถามได้ชัดเจน',
    description: 'เทคนิคการสอน ความกระตือรือร้น และการเปิดโอกาสให้ซักถาม',
  },
  {
    id: 'q3',
    category: 'ด้านการบริหารเวลา',
    title: '3. การจัดลำดับหัวข้อและระยะเวลาในการอบรมมีความเหมาะสม',
    description: 'ความต่อเนื่องของเนื้อหา และเวลาในการปฏิบัติกิจกรรม/ถาม-ตอบ',
  },
  {
    id: 'q4',
    category: 'ด้านสื่อและเอกสาร',
    title: '4. สื่อ เอกสารประกอบ และอุปกรณ์ที่ใช้ในการอบรมมีคุณภาพ',
    description: 'สไลด์ เอกสารแจก ระบบภาพ/เสียง และความพร้อมของสื่อการเรียนรู้',
  },
  {
    id: 'q5',
    category: 'ด้านภาพรวมและการจัดงาน',
    title: '5. ความพึงพอใจต่อภาพรวม บรรยากาศ และการอำนวยความสะดวกในการอบรม',
    description: 'สถานที่ อาหารว่าง การต้อนรับ และความคุ้มค่าของการเข้าร่วม',
  },
];

export const RATING_LEVELS = [
  { score: 5, label: 'มากที่สุด', emoji: '🤩', description: 'ดีเยี่ยม เกินความคาดหวัง' },
  { score: 4, label: 'มาก', emoji: '😊', description: 'ดี เป็นไปตามมาตรฐานที่คาดหวัง' },
  { score: 3, label: 'ปานกลาง', emoji: '😐', description: 'พอใช้ อยู่ในเกณฑ์ปานกลาง' },
  { score: 2, label: 'น้อย', emoji: '🙁', description: 'ควรปรับปรุง มีจุดที่ยังไม่พอใจ' },
  { score: 1, label: 'น้อยที่สุด', emoji: '😞', description: 'ต้องปรับปรุงอย่างเร่งด่วน' },
] as const;

/**
 * เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับตามหลักการวัดและประเมินผล (Best & Kahn / Likert Scale)
 * 4.51 – 5.00 : มากที่สุด (Highest)
 * 3.51 – 4.50 : มาก (High)
 * 2.51 – 3.50 : ปานกลาง (Moderate)
 * 1.51 – 2.50 : น้อย (Low)
 * 1.00 – 1.50 : น้อยที่สุด (Lowest)
 */
export function interpretScore(score: number): RatingInterpretation {
  if (score >= 4.51) {
    return {
      level: 'มากที่สุด',
      levelEn: 'Highest',
      minScore: 4.51,
      maxScore: 5.00,
      colorClass: 'text-emerald-700 dark:text-emerald-300',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      barColor: '#059669', // emerald-600
    };
  }
  if (score >= 3.51) {
    return {
      level: 'มาก',
      levelEn: 'High',
      minScore: 3.51,
      maxScore: 4.50,
      colorClass: 'text-blue-700 dark:text-blue-300',
      bgClass: 'bg-blue-50 dark:bg-blue-950/60',
      borderClass: 'border-blue-200 dark:border-blue-800',
      barColor: '#2563eb', // blue-600
    };
  }
  if (score >= 2.51) {
    return {
      level: 'ปานกลาง',
      levelEn: 'Moderate',
      minScore: 2.51,
      maxScore: 3.50,
      colorClass: 'text-amber-700 dark:text-amber-300',
      bgClass: 'bg-amber-50 dark:bg-amber-950/60',
      borderClass: 'border-amber-200 dark:border-amber-800',
      barColor: '#d97706', // amber-600
    };
  }
  if (score >= 1.51) {
    return {
      level: 'น้อย',
      levelEn: 'Low',
      minScore: 1.51,
      maxScore: 2.50,
      colorClass: 'text-orange-700 dark:text-orange-300',
      bgClass: 'bg-orange-50 dark:bg-orange-950/60',
      borderClass: 'border-orange-200 dark:border-orange-800',
      barColor: '#ea580c', // orange-600
    };
  }
  return {
    level: 'น้อยที่สุด',
    levelEn: 'Lowest',
    minScore: 1.00,
    maxScore: 1.50,
    colorClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50 dark:bg-rose-950/60',
    borderClass: 'border-rose-200 dark:border-rose-800',
    barColor: '#e11d48', // rose-600
  };
}

export function formatThaiDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function calculateSummaryStats(responses: SurveyResponse[]): SummaryStats {
  const total = responses.length;

  const emptyDistribution = (): Record<1 | 2 | 3 | 4 | 5, number> => ({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  if (total === 0) {
    const defaultInterp = interpretScore(5.0);
    return {
      totalResponses: 0,
      overallAverage: 0,
      overallInterpretation: {
        ...defaultInterp,
        level: 'ยังไม่มีข้อมูล',
        levelEn: 'No Data',
        colorClass: 'text-slate-600 dark:text-slate-400',
        bgClass: 'bg-slate-100 dark:bg-slate-800',
        borderClass: 'border-slate-200 dark:border-slate-700',
        barColor: '#94a3b8',
      },
      questionAverages: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
      questionInterpretations: {
        q1: defaultInterp,
        q2: defaultInterp,
        q3: defaultInterp,
        q4: defaultInterp,
        q5: defaultInterp,
      },
      questionDistributions: {
        q1: emptyDistribution(),
        q2: emptyDistribution(),
        q3: emptyDistribution(),
        q4: emptyDistribution(),
        q5: emptyDistribution(),
      },
      highRatingPercentage: 0,
      standardDeviation: 0,
    };
  }

  const sumQ = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  const dist = {
    q1: emptyDistribution(),
    q2: emptyDistribution(),
    q3: emptyDistribution(),
    q4: emptyDistribution(),
    q5: emptyDistribution(),
  };

  let totalQuestionsCount = 0;
  let highScoresCount = 0;
  const allQuestionScores: number[] = [];

  responses.forEach((res) => {
    (['q1', 'q2', 'q3', 'q4', 'q5'] as const).forEach((qKey) => {
      const val = Math.min(5, Math.max(1, Math.round(res[qKey] || 5))) as 1 | 2 | 3 | 4 | 5;
      sumQ[qKey] += val;
      dist[qKey][val] = (dist[qKey][val] || 0) + 1;
      allQuestionScores.push(val);
      totalQuestionsCount += 1;
      if (val >= 4) highScoresCount += 1;
    });
  });

  const avgQ = {
    q1: +(sumQ.q1 / total).toFixed(2),
    q2: +(sumQ.q2 / total).toFixed(2),
    q3: +(sumQ.q3 / total).toFixed(2),
    q4: +(sumQ.q4 / total).toFixed(2),
    q5: +(sumQ.q5 / total).toFixed(2),
  };

  const overallAvg = +(
    (avgQ.q1 + avgQ.q2 + avgQ.q3 + avgQ.q4 + avgQ.q5) / 5
  ).toFixed(2);

  // Standard Deviation calculation
  const meanAll = allQuestionScores.reduce((acc, curr) => acc + curr, 0) / allQuestionScores.length;
  const variance = allQuestionScores.reduce((acc, curr) => acc + Math.pow(curr - meanAll, 2), 0) / (allQuestionScores.length || 1);
  const sd = +Math.sqrt(variance).toFixed(2);

  return {
    totalResponses: total,
    overallAverage: overallAvg,
    overallInterpretation: interpretScore(overallAvg),
    questionAverages: avgQ,
    questionInterpretations: {
      q1: interpretScore(avgQ.q1),
      q2: interpretScore(avgQ.q2),
      q3: interpretScore(avgQ.q3),
      q4: interpretScore(avgQ.q4),
      q5: interpretScore(avgQ.q5),
    },
    questionDistributions: dist,
    highRatingPercentage: totalQuestionsCount > 0 ? Math.round((highScoresCount / totalQuestionsCount) * 100) : 0,
    standardDeviation: sd,
  };
}

/**
 * Generate CSV text with UTF-8 BOM so Thai characters open cleanly in Microsoft Excel & Google Sheets
 */
export function generateResponsesCSV(responses: SurveyResponse[], stats: SummaryStats): string {
  const BOM = '\uFEFF';
  const headers = [
    'ลำดับ',
    'วันเวลาที่ส่ง',
    'ข้อ 1 (เนื้อหา)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (ระยะเวลา)',
    'ข้อ 4 (สื่ออุปกรณ์)',
    'ข้อ 5 (ภาพรวม)',
    'คะแนนเฉลี่ย',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const escapeCSV = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = responses.map((r, idx) => {
    const interp = interpretScore(r.average);
    return [
      idx + 1,
      r.submittedAtFormatted || formatThaiDateTime(r.timestamp),
      r.q1,
      r.q2,
      r.q3,
      r.q4,
      r.q5,
      r.average.toFixed(2),
      interp.level,
      r.feedback ? r.feedback.replace(/[\r\n]+/g, ' ') : '-',
    ].map(escapeCSV).join(',');
  });

  // Add statistical summary rows at the bottom
  const summaryDivider = ['', '', '', '', '', '', '', '', '', ''].join(',');
  const rowAvg = [
    'สรุปผลคะแนนเฉลี่ย (Mean)',
    '-',
    stats.questionAverages.q1.toFixed(2),
    stats.questionAverages.q2.toFixed(2),
    stats.questionAverages.q3.toFixed(2),
    stats.questionAverages.q4.toFixed(2),
    stats.questionAverages.q5.toFixed(2),
    stats.overallAverage.toFixed(2),
    stats.overallInterpretation.level,
    `จำนวนผู้ตอบทั้งหมด ${stats.totalResponses} ท่าน`,
  ].map(escapeCSV).join(',');

  const rowInterp = [
    'การแปลผลตามเกณฑ์ 5 ระดับ',
    '-',
    stats.questionInterpretations.q1.level,
    stats.questionInterpretations.q2.level,
    stats.questionInterpretations.q3.level,
    stats.questionInterpretations.q4.level,
    stats.questionInterpretations.q5.level,
    stats.overallInterpretation.level,
    stats.overallInterpretation.level,
    `ส่วนเบี่ยงเบนมาตรฐาน (S.D.) = ${stats.standardDeviation}`,
  ].map(escapeCSV).join(',');

  const criteriaNote = [
    'เกณฑ์การแปลผล: 4.51-5.00 มากที่สุด | 3.51-4.50 มาก | 2.51-3.50 ปานกลาง | 1.51-2.50 น้อย | 1.00-1.50 น้อยที่สุด',
  ].map(escapeCSV).join(',');

  return (
    BOM +
    [
      headers.map(escapeCSV).join(','),
      ...rows,
      summaryDivider,
      rowAvg,
      rowInterp,
      criteriaNote,
    ].join('\r\n')
  );
}

export function downloadCSVFile(content: string, filename = 'training-evaluation-results.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
