import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSearchConfigStore = defineStore('searchConfig', () => {
  const route = ref('');
  const config = ref({});

  const setRoute = (newRoute) => {
    route.value = newRoute;
  };

  const setConfig = (newConfig) => {
    config.value = newConfig;
  };

  const getRoute = () => {
    return route.value;
  };

  const getConfig = () => {
    return config.value;
  };

  const setSearchConfig = (newRoute, newConfig) => {
    route.value = newRoute;
    config.value = newConfig;
  };

  const resetSearchConfig = () => {
    route.value = '';
    config.value = {};
  };

  return {
    route,
    config,
    setRoute,
    setConfig,
    getConfig,
    getRoute,
    setSearchConfig,
    resetSearchConfig,
  };
});

export default useSearchConfigStore;
