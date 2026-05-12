<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import HouseholdInspectionSelect from '@views/FireInspectionView/Household/HouseholdInspectionSelect.vue';
  import FireInspectionHouseholdStat from '@views/FireInspectionView/Household/HouseholdStat.vue';
  import HouseholdTable from '@views/FireInspectionView/Household/HouseholdTable.vue';
  import { computed } from 'vue';

  import {
    FIRE_INSPECTION_HOUSEHOLD_FILTER,
    FIRE_INSPECTION_HOUSEHOLD_SEARCH_INPUT_LIST,
  } from '@/constants/fireInspection.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useHouseholdFireInspectionUuid from '@/lib/composables/fireInspection/useHouseholdFireInspectionUuid.js';
  import useGetFireInspectionHouseholdList from '@/lib/queries/fireInspection/useGetFireInspectionHouseholdList.js';
  import useGetFireInspectionHouseholdListExcel from '@/lib/queries/fireInspection/useGetFireInspectionHouseholdListExcel.js';
  import useGetFireInspectionList from '@/lib/queries/fireInspection/useGetFireInspectionList.js';

  const { navigateTo } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  // 점검 목록 조회
  const { fireInspectionList, isFireInspectionListLoading } =
    useGetFireInspectionList();

  const { fireInspectionUuid, handleInspectionSelect } =
    useHouseholdFireInspectionUuid({ fireInspectionList });

  // 세대별 현황 목록 조회
  const {
    fireInspectionHouseholdList,
    isFireInspectionHouseholdListLoading,
    fireInspectionHouseholdListError,
    isFireInspectionHouseholdListError,
  } = useGetFireInspectionHouseholdList({
    fireInspectionUuid,
  });

  // 엑셀 다운로드
  const {
    refetchFireInspectionHouseholdListExcel,
    isFireInspectionHouseholdListExcelLoading,
  } = useGetFireInspectionHouseholdListExcel({
    fireInspectionUuid,
  });

  // 로딩 상태
  const isLoading = computed(
    () =>
      isFireInspectionListLoading.value ||
      isFireInspectionHouseholdListLoading.value,
  );

  const hasInspectionList = computed(
    () => !!fireInspectionList.value?.content?.length,
  );

  const selectFilter = (value) => {
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([FIRE_INSPECTION_HOUSEHOLD_FILTER.filterKey]);
    } else {
      updateParam({ [FIRE_INSPECTION_HOUSEHOLD_FILTER.filterKey]: value });
    }
  };

  const goToInspectionList = () => {
    navigateTo({ path: '/fireInspection/list' });
  };
</script>

<template>
  <div>
    <div v-if="hasInspectionList" class="flex flex-1 gap-4">
      <HouseholdInspectionSelect
        :inspection-list="fireInspectionList?.content || []"
        :selected-uuid="fireInspectionUuid"
        :disabled="isLoading || isFireInspectionHouseholdListError"
        @select="handleInspectionSelect"
      />

      <SearchBar
        :search-input="FIRE_INSPECTION_HOUSEHOLD_SEARCH_INPUT_LIST"
        has-reset
        :is-search-loading="isFireInspectionHouseholdListLoading"
        class="w-full"
        :disabled="isLoading || isFireInspectionHouseholdListError"
      >
        <FilterRadioGroup
          :filter="FIRE_INSPECTION_HOUSEHOLD_FILTER"
          :disabled="isLoading || isFireInspectionHouseholdListError"
          @select="selectFilter"
        />
      </SearchBar>
    </div>

    <!-- 로딩중 -->
    <div v-if="isLoading">
      <!-- SearchBar 스켈레톤 -->
      <SkeletonBase class="mb-5 h-10 rounded-lg" />

      <!-- Stat Cards 스켈레톤 (4개) -->
      <div class="mb-7 grid grid-cols-4 gap-2">
        <SkeletonBase
          v-for="item in 4"
          :key="item"
          class="h-[88px] rounded-lg"
        />
      </div>

      <!-- Excel Button 영역 스켈레톤 -->
      <div class="mb-3 flex items-center justify-end">
        <SkeletonBase class="h-10 w-[120px] rounded" />
      </div>

      <!-- Table 스켈레톤 -->
      <SkeletonBase class="h-[600px] rounded-lg" />
    </div>

    <!-- 점검이 없는 경우 -->
    <div
      v-else-if="!hasInspectionList"
      class="flex flex-col items-center justify-center gap-10 py-96"
    >
      <p class="text-defaults-secondary-text-secondary pretendard-16Regular">
        점검을 등록해주세요.
      </p>
      <ButtonBase color="primary" @click="goToInspectionList"
        >신규 점검 등록</ButtonBase
      >
    </div>

    <!-- 에러가 발생한 경우 -->
    <div
      v-else-if="isFireInspectionHouseholdListError"
      class="flex flex-col items-center justify-center gap-2 py-96 text-center"
    >
      <p class="text-defaults-secondary-text-secondary pretendard-16Regular">
        세대별 현황 관리를 불러오는 중 오류가 발생했습니다.
      </p>
      <p
        v-if="fireInspectionHouseholdListError"
        class="text-defaults-primary-text-error pretendard-14Regular"
      >
        {{ fireInspectionHouseholdListError?.data?.error?.message }}
      </p>
    </div>

    <!-- 정상 데이터 표시 -->
    <div v-else>
      <FireInspectionHouseholdStat
        :household-list="fireInspectionHouseholdList"
      />

      <div class="mb-3 flex items-center justify-end">
        <ButtonExcelDown
          :download-fn="refetchFireInspectionHouseholdListExcel"
          :is-loading="isFireInspectionHouseholdListExcelLoading"
          :disabled="fireInspectionHouseholdList?.totalElements <= 0"
        />
      </div>

      <HouseholdTable
        :fire-inspection-uuid="fireInspectionUuid"
        :household-list="fireInspectionHouseholdList"
      />
    </div>
  </div>
</template>
