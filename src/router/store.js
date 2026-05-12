const STORE_ADMIN_PARKING_ROUTES_LIST = [
  // 상가 관리
  {
    path: '/store/management',
    component: () => import('@views/StoreView/Management/ManagementView.vue'),
    meta: {
      title: '아파트먼트 - 상가 관리',
    },
  },
  {
    path: '/store/management/add',
    component: () =>
      import('@views/StoreView/Management/ManagementAddView.vue'),
    meta: {
      title: '아파트먼트 - 상가 등록',
    },
  },
  {
    path: '/store/management/edit/:uuid',
    component: () =>
      import('@views/StoreView/Management/ManagementEditView.vue'),
    meta: {
      title: '아파트먼트 - 상가 수정',
    },
  },
  {
    path: '/store/management/detail/:uuid',
    component: () =>
      import('@views/StoreView/Management/ManagementDetailView.vue'),
    meta: {
      title: '아파트먼트 - 상가 상세',
    },
  },

  // 입출차 내역
  {
    path: '/store/inout-history',
    component: () =>
      import('@views/StoreView/InOutHistory/InOutHistoryView.vue'),
    meta: {
      title: '아파트먼트 - 입출차 내역',
    },
  },
  {
    path: '/store/inout-history/detail/:uuid',
    component: () =>
      import('@views/StoreView/InOutHistory/InOutHistoryDetailView.vue'),
    meta: {
      title: '아파트먼트 - 입출차 내역 상세',
    },
  },

  // 할인 내역
  {
    path: '/store/discount-history',
    component: () =>
      import('@views/StoreView/DiscountHistory/DiscountHistoryView.vue'),
    meta: {
      title: '아파트먼트 - 할인 내역',
    },
  },

  // 충전 내역
  {
    path: '/store/charge-history',
    component: () =>
      import('@views/StoreView/ChargeHistory/ChargeHistoryView.vue'),
    meta: {
      title: '아파트먼트 - 충전 내역',
    },
  },

  // 주차 관리 설정
  {
    path: '/store/setting',
    component: () => import('@views/StoreView/Setting/SettingView.vue'),
    meta: {
      title: '아파트먼트 - 주차 관리 설정',
    },
  },
];

export default STORE_ADMIN_PARKING_ROUTES_LIST;
