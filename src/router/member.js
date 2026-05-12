const APT_ADMIN_MEMBER_ROUTES_LIST = [
  {
    path: '/member/household-info',
    component: () => import('@views/MemberView/HouseholdInfoView.vue'),
    meta: {
      title: '아파트먼트 - 세대정보',
    },
  },
  {
    path: '/member/household-info/detail/:uuid',
    name: '세대정보 세대 상세',
    component: () => import('@views/MemberView/HouseholdInfoDetailView.vue'),
    meta: {
      title: '아파트먼트 - 세대정보',
    },
  },
  {
    path: '/member/member-info',
    name: '등록회원 세대',
    component: () => import('@views/MemberView/MemberInfoView.vue'),
    meta: {
      title: '아파트먼트 - 등록회원',
    },
  },
  {
    path: '/member/member-info/detail/:uuid',
    name: '등록회원 세대 상세',
    component: () => import('@views/MemberView/MemberInfoDetailView.vue'),
    meta: {
      title: '아파트먼트 - 등록회원',
    },
  },
];

export default APT_ADMIN_MEMBER_ROUTES_LIST;
