<script setup>
  import IconErrorInfoRed from '@assets/icons/icon-errorInfo-red.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';


  const props = defineProps({
    state: {
      type: String,
      required: true,
      validator: (value) => ['BEFORE', 'PROGRESS', 'COMPLETED'].includes(value),
    },
    totalCount: {
      type: Number,
      required: true,
      default: 0,
    },
    currentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    successCount: {
      type: Number,
      required: true,
      default: 0,
    },
    failedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    failedItems: {
      type: Array,
      required: false,
      default: () => [],
    },
  });

  const emits = defineEmits(['close']);

  const failedItemsCarNumList = computed(() =>
    props.failedItems.map((item) => item.carNum).join(', '),
  );

  const closeModal = () => {
    emits('close');
  };

  const percentage = computed(() => {
    if (props.totalCount === 0) return 0;

    return Math.round((props.currentCount / props.totalCount) * 100);
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] space-y-6 p-6">
      <!-- 제목 -->
      <div class="flex justify-between gap-2">
        <h1 class="pretendard-18Medium">미출차내역 삭제하기</h1>
      </div>

      <!-- 처리중 -->
      <template v-if="state === 'PROGRESS' || currentCount < totalCount">
        <!-- 프로그레스 바 -->
        <div class="space-y-2">
          <div class="flex justify-between gap-2">
            <span>처리 개수</span>
            <div>
              <span class="font-bold text-brand-default-text-brand">
                {{ currentCount }}개
              </span>
              <span> / {{ totalCount }}개</span>
            </div>
          </div>
          <div class="h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full bg-blue-500 transition-all duration-300 ease-out"
              :style="{ width: `${percentage}%` }"
            ></div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="space-y-4">
          <ButtonBase
            type="button"
            color="primary"
            class="w-full"
            :disabled="state === 'PROGRESS' || currentCount < totalCount"
            @click="closeModal"
          >
            처리중
          </ButtonBase>

          <!-- 메시지 -->
          <div
            class="text-center text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            처리 중에는 창을 닫을 수 없습니다.
          </div>
        </div>
      </template>

      <template v-else-if="state === 'COMPLETED' || currentCount >= totalCount">
        <!-- 완료 메시지 -->
        <div class="space-y-2 text-center">
          <p class="pretendard-16SemiBold">
            총 {{ totalCount }}개 항목 중 {{ successCount }}개가 삭제되었습니다.
          </p>
        </div>

        <!-- 결과 통계(성공, 실패) -->
        <div class="grid grid-cols-2 gap-3">
          <!-- 성공 카드 -->
          <div
            class="rounded-lg border border-green-200 bg-green-50 p-4 text-center"
          >
            <div class="text-2xl font-bold text-green-600">
              {{ successCount.toLocaleString() }}
            </div>
            <div class="text-sm text-green-700">성공</div>
          </div>

          <!-- 실패 카드 -->
          <div
            class="rounded-lg border border-red-200 bg-red-50 p-4 text-center"
          >
            <div class="text-2xl font-bold text-red-600">
              {{ failedCount.toLocaleString() }}
            </div>
            <div class="text-sm text-red-700">실패</div>
          </div>
        </div>

        <!-- 실패 항목 세부사항 (실패가 있을 때만) -->
        <div v-if="failedCount > 0" class="space-y-3">
          <div class="flex items-center gap-2">
            <IconErrorInfoRed class="h-5 w-5" />
            <div class="text-red-700">
              <span class="pretendard-14Medium">삭제 실패 항목</span>
              <span>(다시 시도해주시기 바랍니다.)</span>
            </div>
          </div>

          <div
            class="max-h-32 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 font-medium text-red-800"
          >
            {{ failedItemsCarNumList }}
          </div>
        </div>

        <!-- 확인 버튼 -->
        <ButtonBase
          type="button"
          color="primary"
          class="w-full"
          @click="closeModal"
        >
          확인
        </ButtonBase>
      </template>
    </div>
  </ModalBaseNew>
</template>
