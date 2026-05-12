<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import TableView from '@components/common/TableView.vue';
  import FireInspectionStateBadge from '@views/FireInspectionView/FireInspectionStateBadge.vue';
  import ListCreateModal from '@views/FireInspectionView/List/ListCreateModal.vue';
  import ListDeleteImpossibleModal from '@views/FireInspectionView/List/ListDeleteImpossibleModal.vue';
  import ListDeleteModal from '@views/FireInspectionView/List/ListDeleteModal.vue';
  import { ref } from 'vue';

  import {
    FIRE_INSPECTION_LIST_TABLE_COLUMNS,
    FIRE_INSPECTION_PROGRESS_STATE_KEY,
    FIRE_INSPECTION_PROGRESS_STATE_LABEL,
  } from '@/constants/fireInspection.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetFireInspectionList from '@/lib/queries/fireInspection/useGetFireInspectionList.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const { navigateTo } = useNavigate();

  // 점검 목록 조회
  const { fireInspectionList, isFireInspectionListLoading } =
    useGetFireInspectionList();

  // 모달 상태 관리
  const modalType = ref(null);

  // 삭제할 점검 정보
  const selectedInspection = ref(null);

  // 필드 값 렌더링
  const renderFieldValue = ({ key, row }) => {
    const value = row[key];

    // 점검 제목
    if (key === 'title') {
      return decodeUrl(value);
    }

    // 점검 기간
    if (key === 'period') {
      return `${row.startDate} ~ ${row.endDate}`;
    }

    // 진행 상태
    if (key === 'status') {
      return FIRE_INSPECTION_PROGRESS_STATE_LABEL[value];
    }

    // 점검 대상 세대
    if (key === 'targetHouseholdCount') {
      return `${value}세대`;
    }

    // 점검률
    if (key === 'submissionRate') {
      return {
        percentage: value,
        householdCount: row.submittedHouseholdCount,
      };
    }

    return value || '-';
  };

  // 신규 점검 등록 모달 열기
  const openCreateModal = () => {
    modalType.value = 'create';
  };

  // 모달 닫기
  const closeModal = () => {
    modalType.value = null;
    selectedInspection.value = null;
  };

  // 상세보기
  const moveDetail = (row) => {
    navigateTo(`/fireInspection/household/${row.fireInspectionUuid}`);
  };

  // 점검 삭제
  const deleteInspection = (row) => {
    // 진행중 상태 체크
    if (row.status === FIRE_INSPECTION_PROGRESS_STATE_KEY.IN_PROGRESS) {
      modalType.value = 'deleteImpossible';
      return;
    }

    // 삭제 확인 모달 열기
    selectedInspection.value = row;
    modalType.value = 'delete';
  };
</script>

<template>
  <div class="flex flex-col">
    <!-- 테이블 상단 -->
    <div class="mb-3 flex justify-end">
      <ButtonBase
        type="button"
        color="primary"
        size="md"
        class="flex items-center gap-1"
        @click="openCreateModal"
      >
        신규 점검 등록
      </ButtonBase>
    </div>

    <!-- 테이블 -->
    <TableView
      :column-data="FIRE_INSPECTION_LIST_TABLE_COLUMNS"
      :page-data="fireInspectionList"
      show-count
      :is-loading="isFireInspectionListLoading"
      :row-function="moveDetail"
      :pageable="false"
    >
      <template #default="{ row, column }">
        <!-- 진행 상태 -->
        <FireInspectionStateBadge
          v-if="column.key === 'status'"
          :state="row.status"
        />

        <!-- 점검률 -->
        <div v-else-if="column.key === 'submissionRate'" class="flex gap-1">
          <span class="pretendard-14Bold">
            {{ renderFieldValue({ key: column.key, row }).percentage }}%
          </span>
          <span class="pretendard-14Regular">
            ({{ renderFieldValue({ key: column.key, row }).householdCount }}세대
            완료)
          </span>
        </div>

        <!-- 상세보기 버튼 -->
        <ButtonBase
          v-else-if="column.key === 'action'"
          type="button"
          color="destructive-outlined"
          size="sm"
          @click.stop="deleteInspection(row)"
        >
          삭제
        </ButtonBase>

        <!-- 일반 텍스트 -->
        <span v-else>
          {{ renderFieldValue({ key: column.key, row }) }}
        </span>
      </template>
    </TableView>

    <!-- 신규 점검 등록 모달 -->
    <ListCreateModal v-if="modalType === 'create'" @close="closeModal" />

    <!-- 점검 삭제 불가 안내 모달 -->
    <ListDeleteImpossibleModal
      v-if="modalType === 'deleteImpossible'"
      @close="closeModal"
    />

    <!-- 점검 삭제 확인 모달 -->
    <ListDeleteModal
      v-if="modalType === 'delete' && selectedInspection"
      :inspection-uuid="selectedInspection.fireInspectionUuid"
      :inspection-title="selectedInspection.title"
      @close="closeModal"
    />
  </div>
</template>
