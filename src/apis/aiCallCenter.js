import { aiClient } from '@/apis/axios.js';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || '/api/ai';

// 통화 음원(WAV) 파일 URL — <audio>/WaveSurfer src 로 그대로 사용 (HTTP Range 지원, seek 가능)
export const getAiCallAudioUrl = (callId) =>
  `${AI_API_BASE_URL}/calls/${encodeURIComponent(callId)}/audio`;

// 날짜 범위 상담 전체 조회
export const getAiCalls = async ({ startDate, endDate }) => {
  const response = await aiClient.get('/calls', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response;
};

// 날짜 범위 대시보드 통계 조회
export const getAiDashboard = async ({ startDate, endDate }) => {
  const response = await aiClient.get('/dashboard', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response;
};

// 날짜 범위 품질평가 통계 조회
export const getAiEvaluation = async ({ startDate, endDate }) => {
  const response = await aiClient.get('/evaluation', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response;
};
