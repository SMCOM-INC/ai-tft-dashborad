const APT_ADMIN_MOVING_HOUSE_ROUTES_LIST = [
  // 이사예약
  {
    path: '/movingHouse/calendar',
    name: '이사 스케쥴',
    component: () =>
      import('@views/MovingHouseView/MovingHouseCalendarView.vue'),
    meta: {
      title: '아파트먼트 - 이사예약 관리',
    },
  },
  {
    path: '/movingHouse/settings',
    component: () =>
      import('@views/MovingHouseView/MovingHouseSettingsView.vue'),
    meta: {
      title: '아파트먼트 - 이사예약 관리',
    },
    children: [
      { path: '', redirect: { name: '기본 설정' } },
      {
        path: 'default',
        name: '기본 설정',
        component: () =>
          import('@views/MovingHouseView/MovingHouseSettingsDefaultView.vue'),
        meta: {
          title: '아파트먼트 - 이사예약 관리 :: 기본 설정',
        },
      },
      {
        path: 'dayOff',
        name: '휴무 지정',
        component: () =>
          import('@views/MovingHouseView/MovingHouseSettingsDayOffView.vue'),
        meta: {
          title: '아파트먼트 - 이사예약 관리 :: 휴무 지정',
        },
      },
    ],
  },
];

export default APT_ADMIN_MOVING_HOUSE_ROUTES_LIST;
