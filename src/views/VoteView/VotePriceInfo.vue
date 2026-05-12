<script setup></script>

<template>
  <div :class="`flex flex-col gap-2 rounded-lg bg-blue-s-info-25 p-4 `">
    <div class="text-defaults-secondary-text-secondary pretendard-14SemiBold">
      가격정책
    </div>
    <div class="flex flex-col gap-1 text-defaults-primary-text-primary">
      <p>※ 개별 금액 산정</p>
      <p>
        ※ 매월마다, 진행한 개수(시작일 기준) 및 개별 참여자수 기준 익월 청구
      </p>
    </div>
    <div>
      <span class="text-[17px] font-semibold text-destructive-100"
        >개별 부과금액 = 참여자 * 130원 (VAT 별도)</span
      >
    </div>
  </div>
</template>
