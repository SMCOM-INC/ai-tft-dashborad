import LayoutAuth from '@components/layout/LayoutAuth.vue';
import LayoutBase from '@components/layout/LayoutBase.vue';
import LoginView from '@views/LoginView/LoginView.vue';
import NotFoundView from '@views/NotFoundView/NotFoundView.vue';
import { createRouter, createWebHistory } from 'vue-router';

import { INIT_PAGE_PATH } from '@/constants/common.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
import APT_ADMIN_APT_ROUTES_LIST from '@/router/apt.js';
import APT_ADMIN_APT_MALL_ROUTES_LIST from '@/router/aptMall.js';
import APT_ADMIN_BOARD_ROUTES_LIST from '@/router/board.js';
import APT_ADMIN_DASHBOARD_ROUTES_LIST from '@/router/dashboard.js';
import APT_ADMIN_FIRE_INSPECTION_ROUTES_LIST from '@/router/fireInspection.js';
import MASTER_ADMIN_ROUTES_LIST from '@/router/master.js';
import APT_ADMIN_MEMBER_ROUTES_LIST from '@/router/member.js';
import APT_ADMIN_MOVING_HOUSE_ROUTES_LIST from '@/router/movingHouse.js';
import APT_ADMIN_PARKING_ROUTES_LIST from '@/router/parking.js';
import APT_ADMIN_REPAIR_ROUTES_LIST from '@/router/repair.js';
import STORE_ADMIN_PARKING_ROUTES_LIST from '@/router/store.js';
import APT_ADMIN_SURVEY_ROUTES_LIST from '@/router/survey.js';
import APT_ADMIN_VOTE_ROUTES_LIST from '@/router/vote.js';
import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: LayoutBase,
      children: [
        { path: '', redirect: { name: '로그인 페이지' } },

        {
          path: 'login',
          name: '로그인 페이지',
          component: LoginView,
          meta: {
            title: '아파트먼트 - 로그인',
          },
        },
        {
          path: '/',
          component: LayoutAuth,
          children: [
            ...MASTER_ADMIN_ROUTES_LIST,
            ...APT_ADMIN_DASHBOARD_ROUTES_LIST,
            ...APT_ADMIN_APT_ROUTES_LIST,
            ...APT_ADMIN_MEMBER_ROUTES_LIST,
            ...APT_ADMIN_PARKING_ROUTES_LIST,
            ...APT_ADMIN_BOARD_ROUTES_LIST,
            ...APT_ADMIN_REPAIR_ROUTES_LIST,
            ...APT_ADMIN_VOTE_ROUTES_LIST,
            ...APT_ADMIN_SURVEY_ROUTES_LIST,
            ...APT_ADMIN_APT_MALL_ROUTES_LIST,
            ...APT_ADMIN_MOVING_HOUSE_ROUTES_LIST,
            ...APT_ADMIN_FIRE_INSPECTION_ROUTES_LIST,
            ...STORE_ADMIN_PARKING_ROUTES_LIST,
            {
              path: '/:pathMatch(.*)*',
              name: '404페이지',
              component: NotFoundView,
            },
          ],
        },
      ],
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
});

// 권한별 router 접근 제한
router.beforeEach(async (to, from, next) => {
  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const defaultTitle = '아파트먼트 - 관리자';
  document.title = to.meta.title || defaultTitle;

  // 네트워크 상태 체크
  if (!window.navigator.onLine) {
    swalErrorModal({ text: '네트워크 상태를 확인해주세요' });

    return false;
  }

  if (
    token.userRole === 'master' &&
    to.path !== '/master/apt-management' &&
    (userInfo.aptUuid === undefined || userInfo.aptUuid === '')
  ) {
    return next('/master/apt-management');
  }

  if (to.path === '/login' || to.path === '/setting-password') {
    return next();
  }

  if (
    !token.accessToken ||
    !token.userRole ||
    token.accessToken === 'undefined'
  ) {
    return next('/login');
  }

  if (token.userRole === 'master') {
    return next();
  }

  if (to.path.startsWith('/master') && token.userRole !== 'master') {
    await swalWarningModal({
      title: '접근 권한 에러',
      text: '마스터 관리자만 접근할 수 있는 페이지입니다.',
    });
    return next(INIT_PAGE_PATH);
  }

  next();
});

router.afterEach((to) => {
  if (to.path === '/master/apt-management') {
    window.history.pushState(null, '', '/master/apt-management');
    window.history.replaceState(null, '', '/master/apt-management');
  }
});

export default router;
