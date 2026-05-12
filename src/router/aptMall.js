const APT_ADMIN_APT_MALL_ROUTES_LIST = [
  // 조식예약
  {
    path: '/aptMall/list',
    name: '조식예약 관리',
    component: () => import('@views/AptMallView/AptMallListView.vue'),
    meta: {
      title: '아파트먼트 - 조식예약 관리',
    },
  },

  // 조식예약 상세
  {
    path: '/aptMall/list/:aptMallUuid',
    name: '조식예약 관리 상세',
    component: () => import('@views/AptMallView/AptMallListView.vue'),
    meta: {
      title: '아파트먼트 - 조식예약 관리 상세',
    },
  },
];

export default APT_ADMIN_APT_MALL_ROUTES_LIST;
