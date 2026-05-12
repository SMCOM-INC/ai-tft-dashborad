import { computed } from 'vue';

import { useUserInfoStore } from '@/stores/auth.js';

const useCheckParkingService = () => {
  const { userInfo } = useUserInfoStore();

  const hasParkingService = computed(() => {
    if (!userInfo?.contentList) {
      return false;
    }

    return userInfo.contentList.some((content) => content.name === '주차');
  });

  return {
    hasParkingService,
  };
};

export default useCheckParkingService;
