const APT_ADMIN_SURVEY_ROUTES_LIST = [
  // 설문조사
  {
    path: '/survey/list',
    name: '설문조사 리스트',
    component: () => import('@views/SurveyView/List/SurveyListView.vue'),
    meta: {
      title: '아파트먼트 - 설문조사',
    },
  },
  {
    path: '/survey/create/:groupUuid/:surveyUuid',
    name: '설문조사 추가',
    component: () => import('@views/SurveyView/Form/SurveyCreateView.vue'),
    meta: {
      title: '아파트먼트 - 설문조사',
    },
  },
  {
    path: '/survey/edit/:groupUuid/:surveyUuid',
    name: '설문조사 수정',
    component: () => import('@views/SurveyView/Form/SurveyCreateView.vue'),
    meta: {
      title: '아파트먼트 - 설문조사',
    },
  },
  {
    path: '/survey/detail/:groupUuid/:surveyUuid',
    component: () => import('@views/SurveyView/Detail/SurveyDetailView.vue'),
    meta: {
      title: '아파트먼트 - 설문조사',
    },
    children: [
      { path: '', redirect: { name: '설문조사 기본' } },
      {
        path: 'content',
        name: '설문조사 기본',
        component: () =>
          import('@views/SurveyView/Detail/SurveyDetailContent.vue'),
        meta: {
          title: '아파트먼트 - 설문조사 상세',
        },
      },
      {
        path: 'participants',
        name: '설문조사 참여자',
        component: () =>
          import('@views/SurveyView/Detail/SurveyDetailParticipants.vue'),
        meta: {
          title: '아파트먼트 - 설문조사 상세',
        },
      },
    ],
  },
];

export default APT_ADMIN_SURVEY_ROUTES_LIST;
