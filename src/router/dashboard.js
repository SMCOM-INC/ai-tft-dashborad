const APT_ADMIN_DASHBOARD_ROUTES_LIST = [
  {
    path: '/dashboard',
    component: () => import('@views/DashboardView/DashboardView.vue'),
    meta: {
      title: '아파트먼트 - 대시보드',
    },
  },
];

export default APT_ADMIN_DASHBOARD_ROUTES_LIST;
