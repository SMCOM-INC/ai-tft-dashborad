import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useNavigate = () => {
  const router = useRouter();
  const route = useRoute();

  const navigateTo = (path) => {
    router.push(path);
  };

  const navigateReplace = (path) => {
    router.replace(path);
  };

  const navigateBack = () => {
    router.back();
  };

  const getCurrentRoutePath = () => {
    return route.path;
  };

  const getParams = () => {
    return route.params;
  };

  const getQueryString = () => {
    return route.query;
  };

  const removeQueryParams = (paramsToRemove) => {
    const newQuery = { ...getQueryString() };
    delete newQuery[paramsToRemove];

    if (typeof paramsToRemove === 'string') {
      delete newQuery[paramsToRemove];
    } else if (Array.isArray(paramsToRemove)) {
      paramsToRemove.forEach((param) => {
        delete newQuery[param];
      });
    }

    return newQuery;
  };

  const hasDetailPage = computed(() => {
    return getCurrentRoutePath().includes('detail');
  });

  return {
    navigateTo,
    navigateReplace,
    navigateBack,
    getCurrentRoutePath,
    getQueryString,
    getParams,
    removeQueryParams,
    hasDetailPage,
  };
};

export default useNavigate;
