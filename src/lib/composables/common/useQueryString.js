// useQueryString

import { computed } from 'vue';

import useNavigate from '@/lib/composables/common/useNavigate.js';

const useQueryString = () => {
  const { navigateTo, getCurrentRoutePath, getQueryString } = useNavigate();

  const queryString = computed(() => getQueryString());

  // 저장하지 않을 값인지 확인
  const shouldNotSaveValue = (value) => {
    return (Array.isArray(value) && value.length === 0) || value === 'ALL';
  };

  // 삭제 (배열 형식으로 파라미터 받기)
  const removeParam = (keys) => {
    // 배열이 아니면 배열로 변환
    const keysArray = Array.isArray(keys) ? keys : [keys];

    const currentQuery = { ...queryString.value };

    keysArray.forEach((key) => {
      delete currentQuery[key];
    });

    navigateTo({
      path: getCurrentRoutePath(),
      query: currentQuery,
    });
  };

  // 업데이트 (단일 또는 다중 파라미터 지원)
  const updateParam = (params) => {
    const currentQuery = { ...queryString.value };

    // 업데이트 시, page 초기화
    currentQuery.page = 0;

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || shouldNotSaveValue(value)) {
        delete currentQuery[key];
        return;
      }

      currentQuery[key] = value;
    });

    navigateTo({
      path: getCurrentRoutePath(),
      query: currentQuery,
    });
  };

  // 전체 삭제
  const clearAllParams = () => {
    navigateTo({
      path: getCurrentRoutePath(),
    });
  };

  return {
    updateParam,
    removeParam,
    clearAllParams,
  };
};

export default useQueryString;
