<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';

  import { VOTER_COLUMN_LIST } from '@/constants/vote.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    voterList: {
      type: Array,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const voterCount = computed(() => props.voterList?.length);

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="max-h-[70vh] min-h-[20vh] min-w-[30vw] max-w-[70vw]">
      <!-- 제목 -->
      <div class="flex items-center justify-between gap-4 px-8 py-3">
        <div class="flex gap-3 pretendard-18Medium">
          <h1
            class="border-r border-r-defaults-tertiary-background-tertiary pr-3"
          >
            투표 대상자 확인하기
          </h1>
          <div class="flex items-center">
            <span class="text-brand-default-text-brand pretendard-20Bold">
              {{ voterCount }}
            </span>
            명
          </div>
        </div>
        <ButtonBase
          type="reset"
          color="secondary"
          class="flex items-center gap-2"
          @click="closeModal"
        >
          닫기
        </ButtonBase>
      </div>
      <!-- 표 -->
      <p
        v-if="voterCount <= 0"
        class="mx-auto border-t py-10 text-center font-medium text-muted-foreground-100"
      >
        데이터가 존재하지 않습니다
      </p>
      <div v-else class="max-h-[calc(70vh-66px)] overflow-auto px-8 py-3">
        <table class="w-full border border-defaults-disabled-border-disabled">
          <thead>
            <tr>
              <th
                class="min-h-11 min-w-40 border border-defaults-disabled-border-disabled px-4 py-1.5 text-left"
              >
                번호
              </th>
              <th
                v-for="header in VOTER_COLUMN_LIST"
                :key="header"
                class="min-h-11 min-w-40 border border-defaults-disabled-border-disabled px-4 py-1.5 text-left"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(voter, voterIndex) in voterList" :key="voterIndex">
              <td
                class="min-h-11 border border-defaults-disabled-border-disabled px-4 py-1.5"
              >
                {{ voterIndex + 1 }}
              </td>
              <td
                v-for="(row, rowIndex) in VOTER_COLUMN_LIST"
                :key="rowIndex"
                class="min-h-11 border border-defaults-disabled-border-disabled px-4 py-1.5"
              >
                {{ decodeUrl(voter[row.key]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalBaseNew>
</template>
