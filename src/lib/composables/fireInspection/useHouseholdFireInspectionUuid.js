import { computed, ref, watch } from 'vue';

import useNavigate from '@/lib/composables/common/useNavigate.js';

const useHouseholdFireInspectionUuid = ({ fireInspectionList }) => {
  const { navigateTo, getParams } = useNavigate();
  const params = computed(() => getParams());

  const routeFireInspectionUuid = computed(
    () => params.value.fireInspectionUuid,
  );
  const localFireInspectionUuid = ref(null);

  // query에 전달할 effective UUID (route 우선, 없으면 local)
  const fireInspectionUuid = computed(
    () => routeFireInspectionUuid.value || localFireInspectionUuid.value,
  );

  // 사용자 선택 (route 변경)
  const handleInspectionSelect = (uuid) => {
    if (fireInspectionUuid.value === uuid) return;

    localFireInspectionUuid.value = uuid;

    navigateTo({ path: `/fireInspection/household/${uuid}` });
  };

  // local fallback UUID 설정 (route UUID 유무와 무관하게 항상 첫 항목을 local에 저장)
  watch(
    () => fireInspectionList.value?.content,
    (list) => {
      if (list?.length > 0 && !localFireInspectionUuid.value) {
        localFireInspectionUuid.value = list[0].fireInspectionUuid;
      }
    },
    { immediate: true },
  );

  return { fireInspectionUuid, handleInspectionSelect };
};

export default useHouseholdFireInspectionUuid;
