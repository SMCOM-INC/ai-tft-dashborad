<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import TableView from '@components/common/TableView.vue';
  import AiCallsSummary from '@views/AiCallsView/components/AiCallsSummary.vue';
  import { computed } from 'vue';

  import {
    AI_CALLS_TABLE_COLUMNS,
    AI_DEFAULT_DATE_RANGE,
  } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiCalls from '@/lib/queries/aiCallCenter/useGetAiCalls.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiCalls, isAiCallsLoading, isAiCallsError, aiCallsError } =
    useGetAiCalls();

  const summary = computed(() => ({
    count: aiCalls.value?.count ?? 0,
    avgScoreTotal: aiCalls.value?.avg_score_total ?? 0,
    avgScoreSpeed: aiCalls.value?.avg_score_speed ?? 0,
    avgScoreAccuracy: aiCalls.value?.avg_score_accuracy ?? 0,
    avgScoreProfessionalism: aiCalls.value?.avg_score_professionalism ?? 0,
  }));

  const tableData = computed(() => {
    const calls = aiCalls.value?.calls || [];
    const content = calls.map((call) => ({
      id: call.id,
      date: call.date,
      duration: call.duration,
      categoryMain: call.category_main,
      categorySub: call.category_sub,
      categoryDetail: call.category_detail,
      summary: call.summary,
      scoreSpeed: call.score_speed,
      scoreAccuracy: call.score_accuracy,
      scoreProfessionalism: call.score_professionalism,
      scoreTotal: call.score_total,
    }));

    return {
      content,
      totalElements: content.length,
    };
  });

  const renderCell = ({ key, row }) => {
    const value = row[key];

    if (value === null || value === undefined || value === '') return '-';

    if (key === 'duration') {
      return `${Number(value).toFixed(1)}초`;
    }

    if (key === 'summary' && typeof value === 'string') {
      return decodeUrl(value);
    }

    return value;
  };
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          상담기록
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 상담 상세 내역과 평가 점수를 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div class="stagger-item" :style="{ '--i': 0 }">
      <AiCallsSummary :summary="summary" :is-loading="isAiCallsLoading" />
    </div>

    <div class="stagger-item" :style="{ '--i': 1 }">
      <CardBase padding="flush">
        <TableView
          :column-data="AI_CALLS_TABLE_COLUMNS"
          :page-data="tableData"
          :selectable="false"
          :show-count="true"
          :pageable="false"
          :is-loading="isAiCallsLoading"
          :is-error="isAiCallsError"
          :error="aiCallsError"
        >
          <template #default="{ row, column }">
            {{ renderCell({ key: column.key, row }) }}
          </template>
        </TableView>
      </CardBase>
    </div>
  </div>
</template>
