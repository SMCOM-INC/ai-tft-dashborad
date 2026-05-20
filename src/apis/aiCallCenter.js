import { aiClient } from '@/apis/axios.js';

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
