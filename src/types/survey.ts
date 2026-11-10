export interface SurveyResponse {
  id: string;
  timestamp: string; // ISO string
  submittedAtFormatted: string; // Thai format
  q1: number; // 1-5 เนื้อหาหลักสูตรมีความน่าสนใจและเป็นประโยชน์
  q2: number; // 1-5 วิทยากรมีความรู้ความเชี่ยวชาญและถ่ายทอดได้ชัดเจน
  q3: number; // 1-5 ระยะเวลาและการจัดลำดับหัวข้อมีความเหมาะสม
  q4: number; // 1-5 สื่อ เอกสาร และอุปกรณ์ประกอบการอบรมมีคุณภาพ
  q5: number; // 1-5 ความพึงพอใจต่อภาพรวมและการอำนวยความสะดวก
  feedback?: string; // ข้อเสนอแนะเพิ่มเติม
  average: number; // เฉลี่ยของผู้ตอบคนนี้
  deviceId?: string;
}

export interface QuestionDefinition {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  category: string;
  description: string;
}

export interface SummaryStats {
  totalResponses: number;
  overallAverage: number;
  overallInterpretation: RatingInterpretation;
  questionAverages: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  questionInterpretations: {
    q1: RatingInterpretation;
    q2: RatingInterpretation;
    q3: RatingInterpretation;
    q4: RatingInterpretation;
    q5: RatingInterpretation;
  };
  questionDistributions: {
    q1: Record<1 | 2 | 3 | 4 | 5, number>;
    q2: Record<1 | 2 | 3 | 4 | 5, number>;
    q3: Record<1 | 2 | 3 | 4 | 5, number>;
    q4: Record<1 | 2 | 3 | 4 | 5, number>;
    q5: Record<1 | 2 | 3 | 4 | 5, number>;
  };
  highRatingPercentage: number; // % of scores that are 4 or 5
  standardDeviation: number;
}

export interface RatingInterpretation {
  level: string; // เช่น 'มากที่สุด'
  levelEn: string; // 'Highest'
  minScore: number;
  maxScore: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  barColor: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConnected: boolean;
  useLiveFirebase: boolean;
}
