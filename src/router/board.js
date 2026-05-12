const APT_ADMIN_BOARD_ROUTES_LIST = [
  {
    path: '/board/settings',
    name: '게시판 설정',
    component: () => import('@views/BoardView/SettingView.vue'),
    meta: {
      title: '아파트먼트 - 게시판 설정',
    },
  },
  {
    path: '/board/notice',
    name: '공지사항',
    component: () => import('@views/BoardView/Notice/NoticeView.vue'),
    meta: {
      title: '아파트먼트 - 공지사항',
    },
  },
  {
    path: '/board/notice/detail/:uuid',
    name: '공지사항 상세',
    component: () => import('@views/BoardView/Notice/NoticeDetailView.vue'),
    meta: {
      title: '아파트먼트 - 공지사항 상세',
    },
  },
  {
    path: '/board/notice/create',
    name: '공지사항 등록',
    component: () => import('@views/BoardView/Notice/NoticeCreateView.vue'),
    meta: {
      title: '아파트먼트 - 공지사항 등록',
    },
  },
  {
    path: '/board/notice/edit/:uuid',
    name: '공지사항 수정',
    component: () => import('@views/BoardView/Notice/NoticeEditView.vue'),
    meta: {
      title: '아파트먼트 - 공지사항 수정',
    },
  },
  {
    path: '/board/global-notice',
    name: '단지관리자 전체 공지사항',
    component: () =>
      import('@views/BoardView/GlobalNotice/AptAdminGlobalNoticeView.vue'),
    meta: {
      title: '아파트먼트 - 전체 공지사항',
    },
  },
  {
    path: '/board/global-notice/apt-admin-detail/:uuid',
    name: '단지관리자 전체 공지사항 상세',
    component: () =>
      import('@views/BoardView/GlobalNotice/AptAdminGlobalNoticeDetail.vue'),
    meta: {
      title: '아파트먼트 - 전체 공지사항 상세',
    },
  },
  {
    path: '/board/community',
    component: () => import('@views/BoardView/Community/CommunityView.vue'),
    meta: {
      title: '아파트먼트 - 커뮤니티',
    },
    children: [
      { path: '', redirect: { name: '게시글 관리' } },
      {
        path: 'posts',
        name: '게시글 관리',
        component: () =>
          import('@views/BoardView/Community/CommunityPostListView.vue'),
        meta: {
          title: '아파트먼트 - 게시글 관리',
        },
      },
      {
        path: 'posts/detail/:uuid',
        name: '게시글 상세',
        component: () =>
          import('@views/BoardView/Community/CommunityPostDetailView.vue'),
        meta: {
          title: '아파트먼트 - 게시글',
        },
      },
      {
        path: 'reports',
        name: '신고 게시글 관리',
        component: () =>
          import('@views/BoardView/Community/CommunityReportListView.vue'),
        meta: {
          title: '아파트먼트 - 게시글 신고 관리',
        },
      },
      {
        path: 'reports/detail/:uuid',
        name: '신고 게시글 관리 상세',
        component: () =>
          import('@views/BoardView/Community/CommunityReportDetailView.vue'),
        meta: {
          title: '아파트먼트 - 게시글 신고 관리',
        },
      },
    ],
  },
  {
    path: '/board/complaints',
    name: '민원공간',
    component: () => import('@views/BoardView/Complaints/ComplaintsView.vue'),
    meta: {
      title: '아파트먼트 - 민원공간',
    },
  },
  {
    path: '/board/complaints/detail/:uuid',
    name: '민원공간 상세',
    component: () =>
      import('@views/BoardView/Complaints/ComplaintsDetailView.vue'),
    meta: {
      title: '아파트먼트 - 민원공간',
    },
  },
  {
    path: '/board/blacklist',
    component: () =>
      import('@views/BoardView/BlackList/BoardMemberBlackListView.vue'),
    meta: {
      title: '아파트먼트 - 게시판 블랙리스트',
    },
  },
];

export default APT_ADMIN_BOARD_ROUTES_LIST;
