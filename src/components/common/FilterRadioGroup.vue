<script setup>
  import RadioGroup from '@components/common/RadioGroup.vue';
  import { onClickOutside } from '@vueuse/core';
  import { computed, ref } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const props = defineProps({
    filter: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.filterName && value.filterKey && Array.isArray(value.list);
      },
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    modelValue: {
      type: String,
      default: null,
    },
  });

  const emit = defineEmits(['select']);

  const { getQueryString } = useNavigate();

  const dropdownRef = ref(null);
  const isDropdownOpen = ref(false);

  // URL에서 실제 적용된 값
  const selectedValue = computed(() => {
    // modelValue가 전달되면 우선 사용
    if (props.modelValue !== null) {
      return props.modelValue;
    }

    const queryParams = getQueryString();
    const paramsValue = queryParams[props.filter.filterKey];

    if (paramsValue) {
      return paramsValue;
    }

    // URL에 값이 없으면 첫 번째 옵션 (보통 '전체')
    return props.filter.list[0]?.key || '';
  });

  // 라벨 포맷
  const formattedLabel = computed(() => {
    const selectedOption = props.filter.list.find(
      (option) => option.key === selectedValue.value,
    );

    return selectedOption?.label || '전체';
  });

  // 모달 열기/닫기
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const closeDropdown = () => {
    isDropdownOpen.value = false;
  };

  // 라디오 선택 시 emit 발생
  const selectRadio = (value) => {
    emit('select', value);

    closeDropdown();
  };

  // 모달 외부 클릭 시 닫기
  onClickOutside(dropdownRef, closeDropdown);
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- 필터 버튼 -->
    <button
      type="button"
      class="flex h-10 cursor-pointer items-center justify-between rounded-md border border-defaults-secondary-border-secondary px-4 py-2 hover:bg-gray-50 disabled:bg-gray-100"
      :disabled="disabled"
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
        <div class="max-h-[400px] overflow-y-auto">
          <RadioGroup
            :model-value="selectedValue"
            :options="filter.list"
            :name="`filter-${filter.filterKey}`"
            @update:model-value="selectRadio"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
