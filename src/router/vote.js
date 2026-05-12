const APT_ADMIN_VOTE_ROUTES_LIST = [
  // 전자투표
  {
    path: '/vote/list',
    name: '전자투표 리스트',
    component: () => import('@views/VoteView/List/VoteListView.vue'),
    meta: {
      title: '아파트먼트 - 투표',
    },
  },
  {
    path: '/vote/create/:groupUuid/:voteUuid',
    name: '전자투표 추가',
    component: () => import('@views/VoteView/Form/VoteCreateView.vue'),
    meta: {
      title: '아파트먼트 - 투표',
    },
  },
  {
    path: '/vote/edit/:groupUuid/:voteUuid',
    name: '전자투표 수정',
    component: () => import('@views/VoteView/Form/VoteCreateView.vue'),
    meta: {
      title: '아파트먼트 - 투표',
    },
  },
  {
    path: '/vote/detail/:groupUuid/:voteUuid',
    component: () => import('@views/VoteView/Detail/VoteDetailView.vue'),
    meta: {
      title: '아파트먼트 - 투표',
    },
    children: [
      { path: '', redirect: { name: '기본' } },
      {
        path: 'content',
        name: '기본',
        component: () => import('@views/VoteView/Detail/VoteDetailContent.vue'),
        meta: {
          title: '아파트먼트 - 투표 상세',
        },
      },
      {
        path: 'voters',
        name: '참여자',
        component: () => import('@views/VoteView/Detail/VoteDetailVoters.vue'),
        meta: {
          title: '아파트먼트 - 투표 상세',
        },
      },
    ],
  },
];

export default APT_ADMIN_VOTE_ROUTES_LIST;
