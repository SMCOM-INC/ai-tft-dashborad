<script setup>
  import CheckboxGroup from '@components/common/CheckboxGroup.vue';
  import { onClickOutside } from '@vueuse/core';
  import { computed, ref, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';

  const props = defineProps({
    filter: {
      type: Object,
      required: true,
      validator: (value) => {
        return (
          value.filterName &&
          value.filterKey &&
          value.list &&
          Array.isArray(value.list)
        );
      },
    },
  });

  const { getQueryString } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  const dropdownRef = ref(null);
  const isDropdownOpen = ref(false);
  const draftSelection = ref([]);

  // ALL 옵션 존재 여부
  const hasAllOption = computed(() => {
    return props.filter.list.some((option) => option.key === 'ALL');
  });

  // URL에서 실제 적용된 값
  const actualSelection = computed(() => {
    const queryParams = getQueryString();
    const paramsValue = queryParams[props.filter.filterKey];

    if (paramsValue) {
      return Array.isArray(paramsValue) ? paramsValue : [paramsValue];
    }

    // URL에 값이 없을 때 - 'ALL' 옵션이 있으면 그것만, 없으면 아무것도 선택 안됨
    return hasAllOption.value ? ['ALL'] : [];
  });

  // 라벨 포맷
  const formattedLabel = computed(() => {
    const selectedCount = actualSelection.value.length;
    const totalCount = props.filter.list.length;

    // ALL 옵션이 선택된 경우
    if (hasAllOption.value && actualSelection.value.includes('ALL')) {
      return '전체';
    }

    // 아무것도 선택되지 않은 경우
    if (selectedCount === 0) {
      return '선택';
    }

    // 전체 선택된 경우
    if (selectedCount === totalCount) {
      return '전체';
    }

    return `${selectedCount}개`;
  });

  // 모달 열기/닫기
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const closeDropdown = () => {
    isDropdownOpen.value = false;
  };

  // 적용하기 버튼 클릭
  const applyToActual = () => {
    const isAllSelected =
      draftSelection.value.length === props.filter.list.length;
    const isNoneSelected = draftSelection.value.length === 0;
    const isAllOptionSelected =
      hasAllOption.value && draftSelection.value.includes('ALL');

    // 전체 선택이거나 아무것도 선택 안 된 경우 또는 ALL 옵션이 선택된 경우 URL에서 제거
    if (isAllSelected || isNoneSelected || isAllOptionSelected) {
      removeParam([props.filter.filterKey]);

      closeDropdown();
      return;
    }

    // 일부 선택된 경우 URL에 적용
    updateParam({ [props.filter.filterKey]: draftSelection.value });

    closeDropdown();
  };

  // 드롭다운 열릴 때 draft를 actual로 초기화
  watch(
    isDropdownOpen,
    (newValue) => {
      if (!newValue) {
        return;
      }

      draftSelection.value = [...actualSelection.value];
    },
    { immediate: true },
  );

  // 모달 외부 클릭 시 닫기
  onClickOutside(dropdownRef, closeDropdown);
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- 필터 버튼 -->
    <button
      type="button"
      class="flex h-10 cursor-pointer items-center justify-between rounded-md border border-defaults-secondary-border-secondary px-4 py-2 hover:bg-gray-50"
      @click="toggleDropdown"
    >
      <span
        class="whitespace-nowrap border-r border-r-defaults-secondary-border-secondary pr-2"
      >
        {{ filter.filterName }}
      </span>
      <span
        class="ml-2 whitespace-nowrap rounded-[4px] bg-defaults-secondary-background-secondary px-1"
      >
        {{ formattedLabel }}
      </span>
    </button>

    <!-- 필터 드롭다운 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute z-20 mt-2 min-w-[200px] rounded-md border border-defaults-secondary-border-secondary bg-defaults-primary-background-mono shadow-lg"
      >
        <div class="max-h-[400px] overflow-y-auto pb-10">
          <CheckboxGroup
            v-model="draftSelection"
            :options="filter.list"
            :name="`filter-${filter.filterKey}`"
          />
        </div>

        <!-- 적용 버튼 -->
        <div
          class="absolute bottom-0 left-0 flex w-full justify-end rounded-bl-md rounded-br-md border-t bg-defaults-primary-background-mono p-1.5"
        >
          <button
            type="button"
            class="w-full rounded bg-primary-100 px-2 py-1 text-sm text-white hover:bg-primary-200"
            @click="applyToActual"
          >
            적용하기
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
