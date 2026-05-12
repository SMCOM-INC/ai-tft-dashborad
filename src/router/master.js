const MASTER_ADMIN_ROUTES_LIST = [
  {
    path: '/master',
    redirect: { name: '단지관리' },
  },
  {
    path: '/master/apt-management',
    name: '단지관리',
    component: () => import('@views/AptManagementView/AptManagementView.vue'),
    meta: {
      title: '아파트먼트 - 단지관리',
    },
  },
  {
    path: '/master/apt-management/detail/:uuid',
    name: '단지관리 상세',
    component: () => import('@views/AptManagementView/AptDetailView.vue'),
    meta: {
      title: '아파트먼트 - 단지 상세 정보',
    },
  },
  {
    path: '/master/global-notice',
    name: '전체 공지사항',
    component: () =>
      import('@views/BoardView/GlobalNotice/GlobalNoticeView.vue'),
    meta: {
      title: '아파트먼트 - 전체 공지사항',
    },
  },
  {
    path: '/master/global-notice/create',
    name: '전체 공지사항 등록',
    component: () =>
      import('@views/BoardView/GlobalNotice/GlobalNoticeCreate.vue'),
    meta: {
      title: '아파트먼트 - 전체 공지사항 등록',
    },
  },
  {
    path: '/master/global-notice/detail/:uuid',
    name: '전체 공지사항 상세',
    component: () =>
      import('@views/BoardView/GlobalNotice/GlobalNoticeEdit.vue'),
    meta: {
      title: '아파트먼트 - 전체 공지사항 상세',
    },
  },
];

export default MASTER_ADMIN_ROUTES_LIST;
