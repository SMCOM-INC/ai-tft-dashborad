import axios from 'axios';
import qs from 'qs';

import sentryApiError from '@/lib/sentry/sentryApiError.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useTokenStore } from '@/stores/auth.js';

export const serverRequestUrl = import.meta.env.VITE_APT_API_URL;

const config = {
  baseURL: serverRequestUrl,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
};

export const client = axios.create(config);

export const auth = axios.create(config);

const deleteStoreInfo = () => {
  const { resetToken } = useTokenStore();

  // 액세스토큰 갱신 실패 시 로그아웃 처리
  resetToken();
};

export const handleRefreshTokenError = async () => {
  deleteStoreInfo();

  await swalErrorModal({
    title: '세션이 만료되었습니다.',
    text: '다시 로그인 해주세요.',
    icon: 'warning',
  });

  window.location.href = '/';
};

client.interceptors.request.use(
  (clientConfig) => {
    return clientConfig;
  },
  (error) => {
    return Promise.reject(error.response);
  },
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response;

    // 500대 에러만 Sentry로 전송
    if (status >= 500 && status < 600) {
      sentryApiError(error.response);
    }

    return Promise.reject(error.response);
  },
);

auth.interceptors.request.use(
  (authConfig) => {
    const { token } = useTokenStore();

    if (token.accessToken) {
      authConfig.headers.Authorization = `Bearer ${token.accessToken}`;
    }

    return authConfig;
  },
  (error) => {
    return Promise.reject(error.response);
  },
);

auth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { token, setToken } = useTokenStore();

    const originalRequest = error.config;
    const responseErrorCode = error.response.data.error.errorCode;
    const responseStatus = error.response.status;

    // 500대 에러만 Sentry로 전송
    if (responseStatus >= 500 && responseStatus < 600) {
      sentryApiError(error.response);
    }

    // APT_UUID 비어있을 경우 로그아웃
    if (error.message === 'APT_UUID_REQUIRED') {
      handleRefreshTokenError();

      return Promise.reject(error.response);
    }

    // 408: 토큰 만료 오류 (EXPIRED_TOKEN)
    if (error.response && responseErrorCode === 'EXPIRED_TOKEN') {
      if (!token.refreshToken) {
        return handleRefreshTokenError();
      }

      if (token.refreshToken) {
        try {
          const response = await axios.post(
            `${serverRequestUrl}/apartmant/admin/token-refresh`,
            {},
            {
              headers: {
                'refresh-token': token.refreshToken,
              },
            },
          );

          const newAccessToken = response.headers.authorization;

          setToken({ accessToken: newAccessToken });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return auth(originalRequest);
        } catch (refreshError) {
          handleRefreshTokenError();

          return Promise.reject(refreshError);
        }
      }
    } else if (
      error.response &&
      (error.response.status === 403 ||
        (error.response.status === 400 &&
          responseErrorCode === 'INVALID_TOKEN'))
    ) {
      // 403: 해당 API에 대한 접근 권한이 없는 role로 접근 시도 (FORBIDDEN_TOKEN)
      // 400: 토큰 검증 실패 (INVALID_TOKEN)

      await swalErrorModal({
        title: '접근 권한이 없습니다.',
        text: '유효하지 않은 접근입니다.',
        icon: 'warning',
        callback: () => {
          deleteStoreInfo();

          window.location.href = '/login';
        },
      });
    }
    return Promise.reject(error.response);
  },
);
