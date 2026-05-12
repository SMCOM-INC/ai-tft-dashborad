<script setup>
  import IconCalendarGray from '@assets/icons/icon-calendar-gray.svg';
  import IconCheckCircleGreen from '@assets/icons/icon-check-circle-green.svg';
  import IconDashboardHouse from '@assets/icons/icon-dashboard-house.svg';
  import IconWarningFilledRed from '@assets/icons/icon-warning-filled-red.svg';
  import HouseholdStatCard from '@views/FireInspectionView/Household/HouseholdStatCard.vue';
  import { computed } from 'vue';

  const props = defineProps({
    householdList: {
      type: Object,
      required: false,
      default: null,
    },
  });

  // 통계 데이터 계산
  const stats = computed(() => {
    const data = props.householdList;

    return {
      // startDate ~ endDate 조합
      inspectionPeriod:
        data.startDate && data.endDate
          ? `${data.startDate.replaceAll('-', '.')} ~ ${data.endDate.replaceAll('-', '.')}`
          : '-',
      submitted: {
        count: data.submittedCount || 0,
        percentage: data.submittedRate ? `${data.submittedRate}%` : '0%',
      },
      pending: {
        count: data.notSubmittedCount || 0,
      },
      totalHouseholdCount: {
        count: data.totalHouseholdCount || 0,
      },
    };
  });
</script>

<template>
  <div class="mb-7 grid grid-cols-4 gap-2">
    <HouseholdStatCard
      variant="default"
      label="점검 기간"
      :icon="IconCalendarGray"
      :value="stats.inspectionPeriod"
    />
    <HouseholdStatCard
      variant="success"
      label="제출완료"
      :icon="IconCheckCircleGreen"
      :value="`${stats.submitted.count}세대(${stats.submitted.percentage})`"
    />
    <HouseholdStatCard
      variant="error"
      label="미제출"
      :icon="IconWarningFilledRed"
      :value="`${stats.pending.count}세대`"
    />
    <HouseholdStatCard
      variant="disabled"
      label="총 세대수"
      :icon="IconDashboardHouse"
      :value="`${stats.totalHouseholdCount.count}세대`"
    />
  </div>
</template>
