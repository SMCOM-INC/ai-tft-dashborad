<script setup>
  import { useQueryClient } from '@tanstack/vue-query';
  import InOutHistoryDeleteModal from '@views/ParkingView/InOutHistory/InOutHistoryDeleteModal.vue';
  import InOutHistoryProgressbarModal from '@views/ParkingView/InOutHistory/InOutHistoryProgressbarModal.vue';
  import ModalInOutHistoryResend from '@views/ParkingView/InOutHistory/ModalInOutHistoryResend.vue';
  import { computed, onMounted, ref } from 'vue';

  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import { useGetInOutHistoryResendCount } from '@/lib/queries/aptAdmin/aptAdminResendQueries.js';
  import useDeleteInOutHistory from '@/lib/queries/parkingInoutHistory/useDeleteInOutHistory.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    selectedRows: {
      type: Array,
      default: () => [],
    },
  });

  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  // 모달 상태
  const inOutHistoryResendRef = ref(null);
  const isDeleteModalOpen = ref(false);
  const isProgressModalOpen = ref(false);

  // 프로그레스 상태
  const progressState = ref('BEFORE');
  const progressCurrent = ref(0);
  const progressSuccess = ref(0);
  const progressFailed = ref(0);
  const failedItems = ref([]);

  const isDeletionInProgress = computed(
    () => progressState.value === 'PROGRESS',
  );
  const progressTotal = computed(() => props.selectedRows.length);

  const { deleteInOutHistoryMutationAsync, isDeleteInOutHistoryPending } =
    useDeleteInOutHistory();

  const { resendCountData } = useGetInOutHistoryResendCount();

  // 프로그레스 상태 초기화
  const resetProgressState = () => {
    progressState.value = 'BEFORE';
    progressCurrent.value = 0;
    progressSuccess.value = 0;
    progressFailed.value = 0;
    failedItems.value = [];
  };

  // 삭제 프로세스 시작
  const startDeletion = () => {
    resetProgressState();

    if (resendCountData.value?.reSendCount > 0) {
      // 재전송 카운트가 있으면 재전송 모달 열기
      inOutHistoryResendRef.value?.handleOpenModal();
      return;
    }

    // 삭제 확인 모달 열기
    isDeleteModalOpen.value = true;
  };

  // 삭제 확인 모달 닫기
  const closeDeletionModal = () => {
    isDeleteModalOpen.value = false;
  };

  // 프로그레스 모달 열기
  const openProgressModal = () => {
    isProgressModalOpen.value = true;
  };

  // 프로그레스 모달 닫기
  const closeProgressModal = () => {
    isProgressModalOpen.value = false;
    resetProgressState();

    // 부모에게 완료 알림
    progressState.value = 'COMPLETED';
  };

  // 개별 항목 삭제
  const deleteItem = async (item, uuid) => {
    try {
      await deleteInOutHistoryMutationAsync({
        uuid,
        skipSuccess: true,
        skipError: true,
      });
      progressSuccess.value = progressSuccess.value + 1;
    } catch (error) {
      progressFailed.value = progressFailed.value + 1;
      failedItems.value = [...failedItems.value, item];
    } finally {
      progressCurrent.value = progressCurrent.value + 1;
    }
  };

  // 단일 삭제 처리
  const handleSingleDeletion = async (uuid) => {
    try {
      await deleteInOutHistoryMutationAsync({ uuid });
      closeDeletionModal();
      progressState.value = 'COMPLETED';
    } catch (error) {
      closeDeletionModal();
    }
  };

  // 다중 삭제 처리
  const handleMultipleDeletion = async () => {
    closeDeletionModal();
    openProgressModal();

    progressState.value = 'PROGRESS';
    const uuidList = props.selectedRows.map((item) => item.uuid);

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < props.selectedRows.length; i++) {
      const item = props.selectedRows[i];
      const uuid = uuidList[i];

      await deleteItem(item, uuid);
    }

    // 최종 상태 설정
    queryClient.invalidateQueries(['inOutHistoryList', userInfo.aptUuid]);
    progressState.value = 'COMPLETED';
  };

  // 메인 삭제 함수
  const deleteInOut = async () => {
    if (props.selectedRows.length === 0) {
      alert('삭제할 입출차 내역을 선택해주세요.');
      closeDeletionModal();
      return;
    }

    const uuidList = props.selectedRows.map((item) => item.uuid);

    // 단일/다중 삭제 분기
    if (props.selectedRows.length === 1) {
      await handleSingleDeletion(uuidList[0]);
    } else {
      await handleMultipleDeletion();
    }
  };

  // 페이지 이동 가드 처리
  const handleUnsavedGuard = () => {
    progressState.value = 'BEFORE';
  };

  // 삭제 중 페이지 이동 방지
  useUnsavedChangesGuard([isDeletionInProgress], handleUnsavedGuard);

  onMounted(() => {
    isDeletionInProgress.value = true;
  });

  // 외부에서 접근 가능한 메서드
  defineExpose({
    startDeletion,
  });
</script>

<template>
  <!-- 입출차 동기화 모달 -->
  <ModalInOutHistoryResend ref="inOutHistoryResendRef" hide-button />

  <!-- 입출차 내역 삭제 확인 모달 -->
  <InOutHistoryDeleteModal
    v-if="isDeleteModalOpen"
    :is-loading="isDeleteInOutHistoryPending"
    @close="closeDeletionModal"
    @delete="deleteInOut"
  />

  <!-- 프로그레스 모달 -->
  <InOutHistoryProgressbarModal
    v-if="isProgressModalOpen"
    :progress-state="progressState"
    :progress-current="progressCurrent"
    :progress-total="progressTotal"
    :progress-success="progressSuccess"
    :progress-failed="progressFailed"
    :failed-items="failedItems"
    @close="closeProgressModal"
  />
</template>
