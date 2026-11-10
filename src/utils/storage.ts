import { SurveyResponse } from '../types/survey';
import { formatThaiDateTime } from './evaluation';

const STORAGE_KEY = 'training_survey_responses_v1';
const SUBMISSION_LOCK_KEY = 'training_survey_submitted_token';
const BROADCAST_CHANNEL_NAME = 'training_survey_sync_channel';

// Initial sample responses so the dashboard is alive and demonstrates real-world distribution
export const INITIAL_SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'sample-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    submittedAtFormatted: formatThaiDateTime(new Date(Date.now() - 1000 * 60 * 38).toISOString()),
    q1: 5,
    q2: 5,
    q3: 4,
    q4: 5,
    q5: 5,
    average: 4.8,
    feedback: 'วิทยากรอธิบายเข้าใจง่าย มีกรณีศึกษาจริงให้ทดลองทำ แนะนำจัดหลักสูตรขั้นสูงเพิ่มเติมครับ',
    deviceId: 'sample-device-1',
  },
  {
    id: 'sample-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    submittedAtFormatted: formatThaiDateTime(new Date(Date.now() - 1000 * 60 * 25).toISOString()),
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 4,
    q5: 5,
    average: 4.8,
    feedback: 'การบรรยายกระชับ ไม่น่าเบื่อ ได้ไอเดียกลับไปปรับใช้ในทีมได้ทันที ประทับใจมากค่ะ',
    deviceId: 'sample-device-2',
  },
  {
    id: 'sample-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    submittedAtFormatted: formatThaiDateTime(new Date(Date.now() - 1000 * 60 * 18).toISOString()),
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 4,
    average: 4.2,
    feedback: 'เอกสารประกอบละเอียดดีมาก อยากให้เพิ่มเวลาในช่วง Workshop ปฏิบัติการอีกนิดนึงครับ',
    deviceId: 'sample-device-3',
  },
  {
    id: 'sample-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    submittedAtFormatted: formatThaiDateTime(new Date(Date.now() - 1000 * 60 * 10).toISOString()),
    q1: 5,
    q2: 4,
    q3: 5,
    q4: 5,
    q5: 5,
    average: 4.8,
    feedback: 'อาหารว่างอร่อย สถานที่สะดวกและห้องอบรมแอร์เย็นสบาย วิทยากรเป็นกันเองมาก',
    deviceId: 'sample-device-4',
  },
  {
    id: 'sample-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    submittedAtFormatted: formatThaiDateTime(new Date(Date.now() - 1000 * 60 * 3).toISOString()),
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 5,
    average: 4.4,
    feedback: 'เนื้อหานำไปต่อยอดงานวิจัยและงานประจำได้เลย คุ้มค่าที่ได้มาเข้าร่วม',
    deviceId: 'sample-device-5',
  },
];

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  broadcastChannel = null;
}

export function getStoredResponses(): SurveyResponse[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialize with initial sample responses
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESPONSES));
      return INITIAL_SAMPLE_RESPONSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read responses from storage', err);
    return [];
  }
}

export function saveResponse(newResponse: Omit<SurveyResponse, 'id' | 'timestamp' | 'submittedAtFormatted' | 'average'>): SurveyResponse {
  const current = getStoredResponses();
  const now = new Date();
  const average = +(
    (newResponse.q1 + newResponse.q2 + newResponse.q3 + newResponse.q4 + newResponse.q5) / 5
  ).toFixed(2);

  const fullResponse: SurveyResponse = {
    ...newResponse,
    id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: now.toISOString(),
    submittedAtFormatted: formatThaiDateTime(now.toISOString()),
    average,
  };

  const updated = [fullResponse, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Set device anti-duplicate token
    localStorage.setItem(SUBMISSION_LOCK_KEY, JSON.stringify({
      submittedAt: now.toISOString(),
      responseId: fullResponse.id,
      average: fullResponse.average,
      feedback: fullResponse.feedback || '',
    }));

    // Broadcast to other tabs / windows
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_RESPONSE', payload: fullResponse });
    }
  } catch (err) {
    console.error('Failed to save response to storage', err);
  }

  return fullResponse;
}

export function subscribeToLiveUpdates(callback: (responses: SurveyResponse[]) => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredResponses());
    }
  };

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_RESPONSE' || event.data?.type === 'SYNC_ALL') {
      callback(getStoredResponses());
    }
  };

  window.addEventListener('storage', handleStorageChange);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

export function broadcastAllSync() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SYNC_ALL' });
  }
}

export function checkHasSubmitted(): { hasSubmitted: boolean; info?: { submittedAt: string; average: number; feedback: string } } {
  if (typeof window === 'undefined') return { hasSubmitted: false };
  try {
    const token = localStorage.getItem(SUBMISSION_LOCK_KEY);
    if (!token) return { hasSubmitted: false };
    const parsed = JSON.parse(token);
    return { hasSubmitted: true, info: parsed };
  } catch {
    return { hasSubmitted: false };
  }
}

export function clearSubmissionLock() {
  try {
    localStorage.removeItem(SUBMISSION_LOCK_KEY);
  } catch (err) {
    console.error('Failed to clear submission lock', err);
  }
}

export function clearAllResponses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(SUBMISSION_LOCK_KEY);
    broadcastAllSync();
  } catch (err) {
    console.error('Failed to clear responses', err);
  }
}

export function addQuickSimulatedResponse() {
  const simulatedFeedbacks = [
    'ชอบการยกตัวอย่างของวิทยากรมาก เข้าใจบริบทการทำงานจริงทันที',
    'เนื้อหาเข้มข้นตรงประเด็น อยากให้จัดเวลาช่วงบ่ายเพิ่มอีกครึ่งชั่วโมง',
    'ระบบภาพและเสียงชัดเจนดีมาก สื่อการสอนสวยงามอ่านง่าย',
    'วิทยากรตอบคำถามได้กระจ่างและใจเย็นมาก ขอบคุณทีมงานครับ',
    'อยากให้มีเอกสารฉบับดิจิทัลส่งสรุปให้หลังจบโครงการครับ ประทับใจมาก',
    'บรรยากาศการอบรมสนุกสนาน ได้ความรู้ใหม่และได้แลกเปลี่ยนกับเพื่อนร่วมรุ่น',
  ];

  // Weighted toward positive ratings 4 and 5
  const randomScore = () => {
    const r = Math.random();
    if (r > 0.45) return 5;
    if (r > 0.15) return 4;
    if (r > 0.05) return 3;
    return 2;
  };

  const q1 = randomScore();
  const q2 = Math.random() > 0.3 ? 5 : 4;
  const q3 = randomScore();
  const q4 = randomScore();
  const q5 = randomScore();
  const fb = simulatedFeedbacks[Math.floor(Math.random() * simulatedFeedbacks.length)];

  const current = getStoredResponses();
  const now = new Date();
  const avg = +((q1 + q2 + q3 + q4 + q5) / 5).toFixed(2);
  const newResp: SurveyResponse = {
    id: 'sim-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: now.toISOString(),
    submittedAtFormatted: formatThaiDateTime(now.toISOString()),
    q1,
    q2,
    q3,
    q4,
    q5,
    average: avg,
    feedback: Math.random() > 0.2 ? fb : '',
    deviceId: 'simulated',
  };

  const updated = [newResp, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  broadcastAllSync();
  return newResp;
}
