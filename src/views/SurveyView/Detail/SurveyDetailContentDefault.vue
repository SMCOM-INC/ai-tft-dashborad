<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import SurveyStateChip from '@views/SurveyView/SurveyStateChip.vue';

  import {
    AUTH_TYPE,
    DETAIL_DEFAULTS_TABLE_HEADERS,
  } from '@/constants/survey.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    fetchData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  // 필드 값 렌더링
  const renderFieldValue = (fieldKey) => {
    if (Object.values(props.fetchData).length <= 0) {
      return;
    }

    const fieldValue = props.fetchData[fieldKey];
    const defaultValue =
      typeof fieldValue === 'number' ? fieldValue.toLocaleString() : fieldValue;

    const formatters = {
      groupName: decodeUrl(defaultValue),
      title: decodeUrl(defaultValue),
      authType: AUTH_TYPE.find((item) => item.key === defaultValue)?.label,
      date: `${props.fetchData.startDateTime.slice(0, 16)} ~ ${props.fetchData.endDateTime.slice(0, 16)}`,
      totalRespondentCount: `${defaultValue}명`,
      participationRate: `${defaultValue}%`,
      participantCount: `${defaultValue}명`,
      nonParticipantCount: `${defaultValue}명`,
    };

    return formatters[fieldKey] || fieldValue || '-';
  };
</script>

<template>
  <div>
    <h3 class="pb-3 pretendard-20SemiBold">기본 정보</h3>
    <template v-if="isLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-7 rounded-md" />
    </template>
    <TableInfoBaseNew v-else :table-headers="DETAIL_DEFAULTS_TABLE_HEADERS">
      <template #cell="{ cell }">
        <template v-if="cell.key === 'state'">
          <SurveyStateChip :state="fetchData?.state" />
        </template>
        <template v-else>{{ renderFieldValue(cell.key) }}</template>
      </template>
    </TableInfoBaseNew>
  </div>
</template>
