const APT_ADMIN_PARKING_ROUTES_LIST = [
  // 정기차량
  {
    path: '/parking/regular',
    component: () => import('@views/ParkingView/Regular/RegularView.vue'),
    meta: {
      title: '아파트먼트 - 정기차량',
    },
    children: [
      { path: '', redirect: { name: '정기차량 세대' } },
      {
        path: 'house',
        name: '정기차량 세대',
        component: () =>
          import('@views/ParkingView/Regular/RegularHouseView.vue'),
        meta: {
          title: '아파트먼트 - 정기차량 :: 세대',
        },
      },
      {
        path: 'business',
        name: '정기차량 업무',
        component: () =>
          import('@views/ParkingView/Regular/RegularBusinessView.vue'),
        meta: {
          title: '아파트먼트 - 정기차량 :: 업무',
        },
      },
    ],
  },

  // 마일리지 사용내역
  {
    path: '/parking/mileage',
    component: () => import('@views/ParkingView/Mileage/MileageView.vue'),
    meta: {
      title: '아파트먼트 - 마일리지 사용내역',
    },
  },
  {
    path: '/parking/mileage/detail/:uuid',
    name: '마일리지 사용내역 세대 상세정보',
    component: () => import('@views/ParkingView/Mileage/MileageDetailView.vue'),
    meta: {
      title: '아파트먼트 - 마일리지 사용내역',
    },
  },

  // 입출차 내역
  {
    path: '/parking/inout-history',
    name: '입출차 내역',
    component: () =>
      import('@views/ParkingView/InOutHistory/InOutHistoryView.vue'),
    meta: {
      title: '아파트먼트 - 입출차 내역',
    },
  },
  {
    path: '/parking/inout-history/detail/:uuid',
    name: '입출차 내역 상세정보',
    component: () =>
      import('@views/ParkingView/InOutHistory/InOutHistoryDetailsView.vue'),
    meta: {
      title: '아파트먼트 - 입출차 내역',
    },
  },
  // 미출차 내역
  {
    path: '/parking/notout-history',
    name: '미출차 내역',
    component: () =>
      import('@views/ParkingView/NotOutHistory/NotOutHistoryView.vue'),
    meta: {
      title: '아파트먼트 - 미출차 내역',
    },
  },
  {
    path: '/parking/notout-history/detail/:uuid',
    name: '미출차 내역 상세정보',
    component: () =>
      import('@views/ParkingView/NotOutHistory/NotOutHistoryDetailsView.vue'),
    meta: {
      title: '아파트먼트 - 미출차 내역',
    },
  },
  // 방문 예약
  {
    path: '/parking/reservation',
    name: '방문 예약',
    component: () =>
      import('@views/ParkingView/Reservation/ReservationView.vue'),
    meta: {
      title: '아파트먼트 - 방문 예약',
    },
  },
  // 항상허용 차량
  {
    path: '/parking/always-allow',
    name: '항상허용 차량',
    component: () =>
      import('@views/ParkingView/AlwaysAllow/AlwaysAllowView.vue'),
    meta: {
      title: '아파트먼트 - 항상허용 차량',
    },
  },
  // 거부 및 블랙리스트
  {
    path: '/parking/restriction',
    component: () =>
      import('@views/ParkingView/Restriction/RestrictionView.vue'),
    meta: {
      title: '아파트먼트 - 거부 및 블랙리스트',
    },
    children: [
      { path: '', redirect: { name: '주차 거부' } },
      {
        path: 'parking-reject',
        name: '주차 거부',
        component: () =>
          import(
            '@views/ParkingView/Restriction/RestrictionParkingRejectView.vue'
          ),
        meta: {
          title: '아파트먼트 - 주차 거부',
        },
      },
      {
        path: 'parking-reject/detail/:uuid',
        name: '주차 거부 상세',
        component: () =>
          import(
            '@views/ParkingView/Restriction/RestrictionParkingRejectDetailView.vue'
          ),
        meta: {
          title: '아파트먼트 - 주차 거부',
        },
      },
      {
        path: 'blacklist',
        name: '블랙리스트',
        component: () =>
          import('@views/ParkingView/Restriction/RestrictionBlacklistView.vue'),
        meta: {
          title: '아파트먼트 - 블랙리스트',
        },
      },
    ],
  },
  // 주차 관리 설정
  {
    path: '/parking/settings',
    component: () => import('@views/ParkingView/Setting/SettingView.vue'),
    meta: {
      title: '아파트먼트 - 주차 관리 설정',
    },
    children: [
      { path: '', redirect: { name: '단지 기본 정보' } },
      {
        path: 'basic-info',
        name: '단지 기본 정보',
        component: () =>
          import('@views/ParkingView/Setting/SettingBasicInfoView.vue'),
        meta: {
          title: '아파트먼트 - 단지 기본 정보',
        },
      },
      {
        path: 'house-reservation',
        name: '세대 방문차량',
        component: () =>
          import('@views/ParkingView/Setting/SettingHouseholdView.vue'),
        meta: {
          title: '아파트먼트 - 세대 방문차량',
        },
      },
      {
        path: 'business',
        name: '업무차량',
        component: () =>
          import('@views/ParkingView/Setting/SettingBusinessView.vue'),
        meta: {
          title: '아파트먼트 - 업무차량',
        },
      },
    ],
  },
];

export default APT_ADMIN_PARKING_ROUTES_LIST;
