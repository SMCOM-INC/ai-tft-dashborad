import LayoutAuth from '@components/layout/LayoutAuth.vue';
import LayoutBase from '@components/layout/LayoutBase.vue';
import NotFoundView from '@views/NotFoundView/NotFoundView.vue';
import { createRouter, createWebHistory } from 'vue-router';

import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import AI_CALL_CENTER_ROUTES_LIST from '@/router/aiCallCenter.js';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: LayoutBase,
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: '/',
          component: LayoutAuth,
          children: [
            ...AI_CALL_CENTER_ROUTES_LIST,
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'AI 콜센터 분석';

  if (!window.navigator.onLine) {
    swalErrorModal({ text: '네트워크 상태를 확인해주세요' });
    return false;
  }

  return next();
});

export default router;
