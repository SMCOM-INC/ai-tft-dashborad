const APT_ADMIN_APT_ROUTES_LIST = [
  // 우리 아파트 정보 페이지
  {
    path: '/apt/apt-info',
    component: () => import('@views/AptView/InfoView.vue'),
    children: [
      { path: '', redirect: { name: '기본정보' } },
      {
        path: 'basic-info',
        name: '기본정보',
        component: () => import('@views/AptView/InfoBasicInfoView.vue'),
        meta: {
          title: '아파트먼트 - 우리 아파트 정보',
        },
      },
      {
        path: 'department-info',
        name: '부서별 연락처',
        component: () => import('@views/AptView/InfoDepartmentInfoView.vue'),
        meta: {
          title: '아파트먼트 - 우리 아파트 정보',
        },
      },
      {
        path: 'admin-office-hours',
        name: '관리사무소 운영시간',
        component: () => import('@views/AptView/InfoAdminOfficeHoursView.vue'),
        meta: {
          title: '아파트먼트 - 우리 아파트 정보',
        },
      },
    ],
  },
  {
    path: '/apt/settings',
    name: '단지 관리 설정',
    component: () => import('@views/AptView/SettingView.vue'),
    meta: {
      title: '아파트먼트 - 단지 관리 설정',
    },
  },
];

export default APT_ADMIN_APT_ROUTES_LIST;
