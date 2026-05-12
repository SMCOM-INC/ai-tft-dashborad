import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { jwtDecode } from 'jwt-decode';

import { getAptDetail } from '@/apis/apt.js';
import { postLogin } from '@/apis/auth.js';
import { getStoreAdminDetail } from '@/apis/store.js';
import { INIT_PAGE_PATH } from '@/constants/common.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

const usePostLogin = () => {
  const { setToken } = useTokenStore();
  const { setUserInfo, resetUserInfo } = useUserInfoStore();

  const { navigateTo } = useNavigate();

  const queryClient = useQueryClient();

  const {
    mutate: postLoginMutation,
    isSuccess: isPostLoginSuccess,
    isPending: isPostLoginPending,
    isError: isPostLoginError,
    error: postLoginError,
  } = useMutation({
    mutationFn: ({ id, password }) =>
      postLogin({
        id,
        password,
      }),
    onSuccess: async (response) => {
      // 토큰 정보 얻기 함수 생성
      const getTokenInfo = (value) => {
        const accessToken = value.headers.authorization;
        const refreshToken = value.headers['refresh-token'];

        const decodedToken = jwtDecode(accessToken);
        const userUuid = decodedToken.sub;
        const role = decodedToken.roles[0].replace('ROLE_', '').toLowerCase();
        return { accessToken, refreshToken, userUuid, role };
      };

      // 토큰 정보 store(persist) 저장
      const { accessToken, refreshToken, role } = getTokenInfo(response);

      setToken({ accessToken, refreshToken, userRole: role });

      // role 별로 라우터 이동
      // 최고관리자
      if (role === 'master') {
        return navigateTo('/master/apt-management');
      }
      // 단지관리자
      if (role === 'apt_admin') {
        const aptAdminAptDetailResponse = await queryClient.fetchQuery({
          queryKey: ['aptAdminAptDetail'],
          queryFn: () => getAptDetail(),
        });

        // 단지관리자 정보 로컬 저장
        setUserInfo(aptAdminAptDetailResponse.data.success);

        return navigateTo(INIT_PAGE_PATH);
      }

      // 상가관리자
      if (role === 'store_admin') {
        // 상가관리자 상세 정보 query call
        const storeAdminAptDetailResponse = await queryClient.fetchQuery({
          queryKey: ['storeAdminAptDetail'],
          queryFn: () => getStoreAdminDetail(),
        });

        // 상가관리자 정보 로컬 저장
        setUserInfo(storeAdminAptDetailResponse.data.success);

        return navigateTo('/store/management');
      }
    },
    onError: async () => {
      // store(persist) 초기화
      resetUserInfo();
    },
  });

  return {
    postLoginMutation,
    isPostLoginSuccess,
    isPostLoginPending,
    isPostLoginError,
    postLoginError,
  };
};

export default usePostLogin;
