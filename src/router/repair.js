const APT_ADMIN_REPAIR_ROUTES_LIST = [
  // 하자보수
  {
    path: '/repair/list',
    name: '접수내역',
    component: () => import('@views/RepairView/List/RepairListView.vue'),
    meta: {
      title: '아파트먼트 - 하자보수 관리',
    },
  },
];

export default APT_ADMIN_REPAIR_ROUTES_LIST;
