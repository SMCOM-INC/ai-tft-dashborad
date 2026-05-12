import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 네트워크 에러일 경우 재시도
        if (error.message === 'Network Error') {
          return failureCount < 3;
        }
        return false;
      },
    },
  },
});
