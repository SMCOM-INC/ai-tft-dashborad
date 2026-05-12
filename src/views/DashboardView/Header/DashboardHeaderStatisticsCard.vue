<script setup>
  import IconChevronRightGray from '@assets/icons/icon-chevron-right-grey.svg';

  defineProps({
    label: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    subInfo: {
      type: Object,
      default: null,
    },
  });
</script>

<template>
  <button
    type="button"
    class="flex flex-col gap-2.5 rounded-lg border border-defaults-hover-border-hover bg-defaults-secondary-background-mono px-[14px] py-3 transition-colors"
  >
    <div class="flex items-center justify-between gap-4">
      <p class="break-keep text-left pretendard-14Medium">
        {{ label }}
      </p>
      <IconChevronRightGray class="h-[12px] w-[12px]" />
    </div>

    <div class="flex w-full items-center gap-3">
      <p class="text-defaults-primary-text-primary pretendard-20Bold">
        {{ count.toLocaleString() }}{{ unit }}
      </p>

      <div
        v-if="subInfo"
        class="flex items-center gap-[3px] pt-2 pretendard-12Medium"
      >
        <p
          class="whitespace-nowrap text-defaults-primary-text-primary pretendard-12SemiBold"
        >
          방문 {{ subInfo.actual.toLocaleString() }}건
        </p>
        <p class="whitespace-nowrap text-defaults-secondary-text-secondary">
          / 예약 {{ subInfo.reserved.toLocaleString() }}건
        </p>
      </div>
    </div>
  </button>
</template>
