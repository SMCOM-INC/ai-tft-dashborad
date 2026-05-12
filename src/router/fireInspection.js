const APT_ADMIN_FIRE_INSPECTION_ROUTES_LIST = [
  {
    path: '/fireInspection',
    component: () => import('@views/FireInspectionView/FireInspectionView.vue'),
    meta: {
      title: '아파트먼트 - 소방 자가 점검',
    },
    children: [
      { path: '', redirect: { name: '세대별 현황 관리' } },
      {
        path: 'household',
        name: '세대별 현황 관리',
        component: () =>
          import('@views/FireInspectionView/Household/HouseholdView.vue'),
        meta: {
          title: '아파트먼트 - 세대별 현황 관리',
        },
      },
      {
        path: 'household/:fireInspectionUuid',
        name: '세대별 현황 관리 상세',
        component: () =>
          import('@views/FireInspectionView/Household/HouseholdView.vue'),
        meta: {
          title: '아파트먼트 - 세대별 현황 관리 상세',
        },
      },
      {
        path: 'list',
        name: '점검 목록',
        component: () => import('@views/FireInspectionView/List/ListView.vue'),
        meta: {
          title: '아파트먼트 - 점검 목록',
        },
      },
    ],
  },
];

export default APT_ADMIN_FIRE_INSPECTION_ROUTES_LIST;
