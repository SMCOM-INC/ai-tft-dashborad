<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import TableView from '@components/common/TableView.vue';
  import FireInspectionStateBadge from '@views/FireInspectionView/FireInspectionStateBadge.vue';
  import HouseholdTableDetailModal from '@views/FireInspectionView/Household/HouseholdTableDetailModal.vue';
  import HouseholdTableRegisterModal from '@views/FireInspectionView/Household/HouseholdTableRegisterModal.vue';
  import { ref } from 'vue';

  import {
    FIRE_INSPECTION_HOUSEHOLD_TABLE_COLUMNS,
    FIRE_INSPECTION_SUBMISSION_TYPE_LABEL,
    FIRE_INSPECTION_SUBMIT_STATE_KEY,
    FIRE_INSPECTION_SUBMIT_STATE_LABEL,
  } from '@/constants/fireInspection.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  defineProps({
    fireInspectionUuid: {
      type: String,
      required: true,
    },
    householdList: {
      type: Object,
      required: false,
      default: null,
    },
  });

  // 필드 값 렌더링
  const renderFieldValue = ({ key, row }) => {
    const value = row[key];

    if (key === 'submissionType') {
      return FIRE_INSPECTION_SUBMISSION_TYPE_LABEL[value] || '-';
    }

    if (key === 'inspectorPhone') {
      return formatContact(value) || '-';
    }

    if (key === 'submissionDateTime') {
      if (!value) return '-';
      return formatDate(value).full();
    }

    if (key === 'submissionStatus') {
      return FIRE_INSPECTION_SUBMIT_STATE_LABEL[value];
    }

    if (['normalCount', 'defectiveCount', 'notApplicableCount'].includes(key)) {
      return row.submissionStatus === FIRE_INSPECTION_SUBMIT_STATE_KEY.SUBMITTED
        ? value
        : '-';
    }

    return value || '-';
  };

  const modalType = ref(null);
  const selectedRow = ref(null);

  // 모달 닫기
  const closeModal = () => {
    modalType.value = null;
    selectedRow.value = null;
  };

  // 수기등록 버튼
  const openRegisterModal = (row) => {
    selectedRow.value = row;
    modalType.value = 'inspectionRegister';
  };

  // 상세보기 버튼
  const openDetailModal = (row) => {
    selectedRow.value = row;
    modalType.value = 'inspectionDetail';
  };
</script>

<template>
  <TableView
    :column-data="FIRE_INSPECTION_HOUSEHOLD_TABLE_COLUMNS"
    :page-data="householdList"
    :show-count="false"
  >
    <template #default="{ row, column }">
      <FireInspectionStateBadge
        v-if="column.key === 'submissionStatus'"
        :state="row.submissionStatus"
      />

      <ButtonBase
        v-else-if="
          column.key === 'action' &&
          row.submissionStatus ===
            FIRE_INSPECTION_SUBMIT_STATE_KEY.NOT_SUBMITTED
        "
        key="button-register"
        type="button"
        color="outlined"
        size="sm"
        @click.stop="openRegisterModal(row)"
      >
        수기등록
      </ButtonBase>
      <ButtonBase
        v-else-if="
          column.key === 'action' &&
          row.submissionStatus === FIRE_INSPECTION_SUBMIT_STATE_KEY.SUBMITTED
        "
        key="button-detail"
        type="button"
        color="secondary"
        size="sm"
        @click.stop="openDetailModal(row)"
      >
        상세보기
      </ButtonBase>

      <span v-else>
        {{ renderFieldValue({ key: column.key, row }) }}
      </span>
    </template>
  </TableView>

  <HouseholdTableRegisterModal
    v-if="modalType === 'inspectionRegister' && selectedRow"
    :fire-inspection-uuid="fireInspectionUuid"
    :household-info="selectedRow"
    @close="closeModal"
  />

  <HouseholdTableDetailModal
    v-if="modalType === 'inspectionDetail' && selectedRow"
    :fire-inspection-uuid="fireInspectionUuid"
    :household-info="selectedRow"
    @close="closeModal"
  />
</template>
