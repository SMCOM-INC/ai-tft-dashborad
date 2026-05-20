const AI_CALL_CENTER_ROUTES_LIST = [
  {
    path: '/dashboard',
    name: 'AI 대시보드',
    component: () => import('@views/AiDashboardView/AiDashboardView.vue'),
    meta: {
      title: 'AI 콜센터 - 대시보드',
    },
  },
  {
    path: '/calls',
    name: '상담기록',
    component: () => import('@views/AiCallsView/AiCallsView.vue'),
    meta: {
      title: 'AI 콜센터 - 상담기록',
    },
  },
  {
    path: '/evaluation',
    name: '품질평가',
    component: () => import('@views/AiEvaluationView/AiEvaluationView.vue'),
    meta: {
      title: 'AI 콜센터 - 품질평가',
    },
  },
];

export default AI_CALL_CENTER_ROUTES_LIST;
