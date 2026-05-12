<script setup>

  import IconChevronLeftBlack from '@assets/icons/icon-chevron-left-black.svg';
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import IconFirstBlack from '@assets/icons/icon-first-black.svg';
  import IconFirstGray from '@assets/icons/icon-first-gray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    paginationData: { type: Object, required: true },
    selectable: { type: Boolean, required: false, default: false },
    selectedRowsCount: { type: Number, required: false, default: undefined },
    bulkActionFlag: { type: Boolean, required: false, default: false },
    bulkActionButtons: {
      type: Array,
      required: false,
      default: () => [],
      validator: (value) => {
        return value.every(
          (button) =>
            typeof button === 'object' &&
            'text' in button &&
            'action' in button &&
            'color' in button &&
            'disabled' in button,
        );
      },
    },
  });

  const emit = defineEmits(['update:page', 'update:size', 'bulkAction']);

  const totalPages = ref(1);
  const page = ref(0);
  const size = ref(10);
  const maxVisiblePages = 5;
  const currentStartPage = ref(1);

  const visiblePages = computed(() => {
    const startPage = currentStartPage.value;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  });

  const currentPage = computed(() => page.value + 1);

  const initializePagination = () => {
    if (props.paginationData) {
      totalPages.value = props.paginationData.totalPages || 1;
      page.value = props.paginationData.page || 0;
      size.value = props.paginationData.size || 10;
    }
  };

  const lastItemIndex = computed(() => {
    return Math.min(
      (page.value + 1) * size.value,
      props.paginationData?.totalElements || 0,
    );
  });

  const dataRangeDisplay = computed(() => {
    const start = page.value * size.value + 1;
    return `중 ${start} - ${lastItemIndex.value}건`;
  });

  const updateVisiblePages = () => {
    currentStartPage.value = Math.max(
      1,
      Math.floor(page.value / maxVisiblePages) * maxVisiblePages + 1,
    );
  };

  watch([size], ([newSize]) => {
    emit('update:size', newSize);
  });

  watch([page], ([newPage]) => {
    updateVisiblePages();
    emit('update:page', newPage);
  });

  watch([page, totalPages], updateVisiblePages);

  watch(
    () => props.paginationData,
    (newPaginationData) => {
      if (newPaginationData) {
        totalPages.value = newPaginationData.totalPages || 1;
        page.value = newPaginationData.page ?? 0;
        size.value = newPaginationData.size ?? 10;
        updateVisiblePages();
      }
    },
    { immediate: true, deep: true },
  );

  const handleMovePreviousPage = () => {
    if (page.value > 0) {
      emit('update:page', page.value - 1);
    }
  };

  const handleMoveNextPage = () => {
    if (page.value < totalPages.value - 1) {
      emit('update:page', page.value + 1);
    }
  };

  const handleMoveLastPage = () => {
    if (page.value < totalPages.value - 1) {
      emit('update:page', totalPages.value - 1);
    }
  };

  const handlePageChangeButton = (navigationPage) => {
    emit('update:page', navigationPage - 1);
  };

  const handleBulkAction = (action) => {
    emit('bulkAction', action);
  };

  const mapButtonColor = (color) => {
    const colorMap = {
      red: 'destructive',
      deepBlue: 'primary',
      lightGray: 'secondary-fill',
    };
    return colorMap[color] || 'primary';
  };

  onMounted(initializePagination);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center justify-start">
      <p class="text-muted-foreground-100 pretendard-muted">
        <span
          >총
          {{ props.paginationData?.totalElements?.toLocaleString() || 0 }} 건
        </span>
        <span v-if="props.selectable"
          >중 {{ props.selectedRowsCount?.toLocaleString() }}건 선택됨</span
        >
        <span v-else>
          {{ dataRangeDisplay }}
        </span>
      </p>
      <template v-if="props.bulkActionFlag && props.selectedRowsCount > 0">
        <ButtonBase
          v-for="(button, index) in props.bulkActionButtons"
          :key="index"
          type="button"
          :color="mapButtonColor(button.color)"
          custom-class="ml-4"
          :disabled="button.disabled"
          @click="handleBulkAction(button.action)"
        >
          {{ button.text }}
        </ButtonBase>
      </template>
    </div>
    <div class="flex items-center gap-3">
      <div class="border-input-100 relative rounded-md border">
        <select
          v-model="size"
          name="counts"
          class="icon-chevron-down select-background-position-custom z-10 w-28 cursor-pointer rounded-md bg-no-repeat py-2 pl-3 pr-[38px]"
        >
          <option value="10" selected>10개씩</option>
          <option v-if="props.paginationData?.totalElements >= 30" value="30">
            30개씩
          </option>
          <option v-if="props.paginationData?.totalElements >= 50" value="50">
            50개씩
          </option>
          <option v-if="props.paginationData?.totalElements >= 100" value="100">
            100개씩
          </option>
        </select>
      </div>
      <div class="flex">
        <button
          type="button"
          class="leading-2 mr-2 flex h-8 w-8 items-center justify-center rounded-md border border-dark-100 text-sm shadow-sm"
          :disabled="page === 0"
          title="첫 페이지"
          @click="handlePageChangeButton(1)"
        >
          <IconFirstGray
            v-if="page === 0"
            key="first-gray"
            class="h-3 w-3"
            alt="첫 페이지로 이동"
            disabled
          />
          <IconFirstBlack
            v-else
            key="first-black"
            class="h-3 w-3"
            alt="첫 페이지로 이동"
          />
        </button>
        <button
          type="button"
          class="leading-2 flex h-8 w-8 items-center justify-center rounded-md border border-dark-100 text-sm shadow-sm"
          :disabled="page === 0"
          title="이전 페이지"
          @click="handleMovePreviousPage"
        >
          <IconChevronLeftGray
            v-if="page === 0"
            key="left-gray"
            class="h-3 w-3"
            alt="왼쪽 화살표 아이콘"
          />
          <IconChevronLeftBlack
            v-else
            key="left-black"
            class="h-3 w-3"
            alt="왼쪽 화살표 아이콘"
          />
        </button>
        <ol class="mx-2 flex max-w-44 gap-1 overflow-hidden">
          <li v-for="pageNum in visiblePages" :key="pageNum">
            <button
              type="button"
              :class="`h-8 w-8 rounded-md shadow-sm pretendard-small ${
                pageNum === currentPage
                  ? ' bg-primary-100 text-background-100 '
                  : 'border'
              }`"
              @click="handlePageChangeButton(pageNum)"
            >
              {{ pageNum }}
            </button>
          </li>
        </ol>
        <button
          type="button"
          class="leading-2 flex h-8 w-8 items-center justify-center rounded-md border border-dark-100 text-sm shadow-sm"
          :disabled="page === totalPages - 1"
          title="다음 페이지"
          @click="handleMoveNextPage"
        >
          <IconChevronLeftGray
            v-if="page === totalPages - 1"
            key="right-black"
            class="h-3 w-3 -scale-x-100 transform"
            alt="오른쪽 화살표 아이콘"
          />
          <IconChevronLeftBlack
            v-else
            key="right-gray"
            class="h-3 w-3 -scale-x-100 transform"
            alt="오른쪽 화살표 아이콘"
          />
        </button>
        <button
          type="button"
          class="leading-2 ml-2 flex h-8 w-8 items-center justify-center rounded-md border border-dark-100 text-sm shadow-sm"
          :disabled="page === totalPages - 1"
          title="마지막 페이지"
          @click="handleMoveLastPage"
        >
          <IconFirstGray
            v-if="page === totalPages - 1"
            key="last-gray"
            class="h-3 w-3 -scale-x-100 transform"
            alt="마지막 페이지로 이동"
            disabled
          />
          <IconFirstBlack
            v-else
            key="last-black"
            class="h-3 w-3 -scale-x-100 transform"
            alt="마지막 페이지로 이동"
          />
        </button>
      </div>
    </div>
  </div>
</template>
