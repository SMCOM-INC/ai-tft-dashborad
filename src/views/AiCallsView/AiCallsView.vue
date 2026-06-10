<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import TableView from '@components/common/TableView.vue';
  import AiCallDetailModal from '@views/AiCallsView/components/AiCallDetailModal.vue';
  import AiCallsSummary from '@views/AiCallsView/components/AiCallsSummary.vue';
  import { computed, ref } from 'vue';

  import { getAiCallAudioUrl } from '@/apis/aiCallCenter.js';
  import {
    AI_CALLS_DURATION_RANGES,
    AI_CALLS_TABLE_COLUMNS,
    AI_DEFAULT_DATE_RANGE,
  } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetAiCalls from '@/lib/queries/aiCallCenter/useGetAiCalls.js';
  import useGetAiEvaluation from '@/lib/queries/aiCallCenter/useGetAiEvaluation.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { getQueryString } = useNavigate();
  const { updateParam, removeParam } = useQueryString();
  const queryParams = computed(() => getQueryString());

  const { aiCalls, isAiCallsLoading, isAiCallsError, aiCallsError } =
    useGetAiCalls();

  const { aiEvaluation, isAiEvaluationLoading } = useGetAiEvaluation();

  const summary = computed(() => ({
    count: aiCalls.value?.total ?? 0,
    avgScoreTotal: aiEvaluation.value?.avg_score_total ?? 0,
    avgScoreSpeed: aiEvaluation.value?.avg_score_speed ?? 0,
    avgScoreAccuracy: aiEvaluation.value?.avg_score_accuracy ?? 0,
    avgScoreProfessionalism: aiEvaluation.value?.avg_score_professionalism ?? 0,
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
      // 통화 음원: /calls/{id}/audio 엔드포인트 URL (WaveSurfer src). 파일 없으면 플레이어가 404 처리
      audioUrl: call.id ? getAiCallAudioUrl(call.id) : null,
      // 통화 원문: 원본(화자라벨) / 가공본 — 없으면 모달이 목데이터로 fallback
      originalText: call.original_text ?? null,
      correctedText: call.corrected_text ?? null,
    }));

    return {
      content,
      totalElements: content.length,
    };
  });

  // 받아온 데이터에서 분류 고유값을 추출해 체크박스 필터 옵션 생성
  const buildCategoryFilter = (filterName, key) => {
    const values = [
      ...new Set(tableData.value.content.map((row) => row[key]).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, 'ko'));

    return {
      filterName,
      filterKey: key,
      list: [
        { key: 'ALL', label: '전체' },
        ...values.map((value) => ({ key: value, label: value })),
      ],
    };
  };

  const categoryMainFilter = computed(() =>
    buildCategoryFilter('대분류', 'categoryMain'),
  );
  const categorySubFilter = computed(() =>
    buildCategoryFilter('중분류', 'categorySub'),
  );
  const categoryDetailFilter = computed(() =>
    buildCategoryFilter('소분류', 'categoryDetail'),
  );

  const durationFilter = {
    filterName: '통화시간',
    filterKey: 'duration',
    list: [
      { key: 'ALL', label: '전체' },
      ...AI_CALLS_DURATION_RANGES.map((range) => ({
        key: range.key,
        label: range.label,
      })),
    ],
  };

  // URL 파라미터를 항상 배열로 정규화 (단일 값도 배열로)
  const toSelectionArray = (value) => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  };

  // URL 파라미터 기준 클라이언트 필터링(AND) + 통화시간 정렬
  const filteredCalls = computed(() => {
    const mainSelection = toSelectionArray(queryParams.value.categoryMain);
    const subSelection = toSelectionArray(queryParams.value.categorySub);
    const detailSelection = toSelectionArray(queryParams.value.categoryDetail);
    const durationSelection = toSelectionArray(queryParams.value.duration);

    let rows = tableData.value.content;

    if (mainSelection.length) {
      rows = rows.filter((row) => mainSelection.includes(row.categoryMain));
    }
    if (subSelection.length) {
      rows = rows.filter((row) => subSelection.includes(row.categorySub));
    }
    if (detailSelection.length) {
      rows = rows.filter((row) => detailSelection.includes(row.categoryDetail));
    }
    if (durationSelection.length) {
      const selectedRanges = AI_CALLS_DURATION_RANGES.filter((range) =>
        durationSelection.includes(range.key),
      );
      rows = rows.filter((row) =>
        selectedRanges.some(
          (range) => row.duration >= range.min && row.duration < range.max,
        ),
      );
    }

    if (queryParams.value.sort === 'duration_asc') {
      rows = [...rows].sort((a, b) => a.duration - b.duration);
    } else if (queryParams.value.sort === 'duration_desc') {
      rows = [...rows].sort((a, b) => b.duration - a.duration);
    }

    return rows;
  });

  const displayData = computed(() => ({
    content: filteredCalls.value,
    totalElements: filteredCalls.value.length,
  }));

  // 통화시간 정렬 토글 (없음 → 오름차순 → 내림차순 → 없음)
  const durationSort = computed(() => queryParams.value.sort ?? null);

  const durationSortLabel = computed(() => {
    if (durationSort.value === 'duration_asc') return '통화시간 ↑';
    if (durationSort.value === 'duration_desc') return '통화시간 ↓';
    return '통화시간 ↕';
  });

  const toggleDurationSort = () => {
    if (durationSort.value === 'duration_asc') {
      updateParam({ sort: 'duration_desc' });
    } else if (durationSort.value === 'duration_desc') {
      removeParam(['sort']);
    } else {
      updateParam({ sort: 'duration_asc' });
    }
  };

  // 행 클릭 시 통화 상세 모달 오픈
  const selectedCall = ref(null);

  const openCallDetail = (row) => {
    selectedCall.value = row;
  };

  const closeCallDetail = () => {
    selectedCall.value = null;
  };

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
      <AiCallsSummary
        :summary="summary"
        :is-loading="isAiCallsLoading || isAiEvaluationLoading"
      />
    </div>

    <div class="stagger-item space-y-4" :style="{ '--i': 1 }">
      <div class="flex flex-wrap items-center gap-2">
        <FilterCheckboxGroup :filter="categoryMainFilter" />
        <FilterCheckboxGroup :filter="categorySubFilter" />
        <FilterCheckboxGroup :filter="categoryDetailFilter" />
        <FilterCheckboxGroup :filter="durationFilter" />
        <button
          type="button"
          class="flex h-10 cursor-pointer items-center whitespace-nowrap rounded-md border border-defaults-secondary-border-secondary px-4 py-2 hover:bg-gray-50"
          @click="toggleDurationSort"
        >
          {{ durationSortLabel }}
        </button>
      </div>

      <CardBase padding="flush">
        <TableView
          :column-data="AI_CALLS_TABLE_COLUMNS"
          :page-data="displayData"
          :selectable="false"
          :show-count="true"
          :pageable="false"
          :row-function="openCallDetail"
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

    <AiCallDetailModal
      v-if="selectedCall"
      :call="selectedCall"
      @close="closeCallDetail"
    />
  </div>
</template>
