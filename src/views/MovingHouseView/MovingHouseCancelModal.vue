<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import { ref } from 'vue';

  import { useCancelMoveHouseReservation } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    moveReservationUuid: { type: String, required: true },
  });

  const emits = defineEmits(['close', 'cancel']);

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const cancelReason = ref('');

  const {
    cancelMoveHouseReservationMutation,
    isCancelMoveHouseReservationLoading,
  } = useCancelMoveHouseReservation(aptUuid, props.moveReservationUuid);

  const closeModal = () => {
    emits('close');
  };

  const handleReservationCancel = async () => {
    // 유효성 검사
    if (!cancelReason.value.trim()) {
      swalWarningModal({
        text: '취소 사유를 입력해주세요.',
      });
      return;
    }

    try {
      await cancelMoveHouseReservationMutation({
        cancelReason: cancelReason.value.trim(),
      });

      swalSuccessModal({
        title: '예약이 취소되었습니다.',
      });

      emits('cancel');
      closeModal();
    } catch (error) {
      const message =
        error?.data?.error?.message || '예약 취소에 실패했습니다.';
      swalErrorModal({
        text: message,
      });
    }
  };
</script>

<template>
  <div
    class="fixed left-[0px] top-[0px] z-[1000] flex h-screen w-screen items-center justify-center bg-black/50 p-5"
    @click="closeModal"
  >
    <div class="absolute min-w-[400px] rounded-md bg-white" @click.stop>
      <h1 class="border-b border-b-[#E2E8F0] px-6 py-4 pretendard-h4">
        예약 취소하기
      </h1>
      <div class="flex flex-col gap-6 p-6">
        <div class="flex flex-col gap-2">
          <label for="cancelReason" class="font-medium">취소 사유 입력</label>
          <textarea
            id="cancelReason"
            v-model="cancelReason"
            :rows="5"
            :maxlength="100"
            :placeholder="`메모를 입력해주세요.
(최대 공백 포함 100자 이내)`"
            class="rounded-md border px-3 py-2 leading-5 placeholder:text-muted-foreground-100"
          />
        </div>
        <div class="flex justify-end gap-2">
          <ButtonBase type="button" color="secondary" @click="closeModal">
            닫기
          </ButtonBase>
          <ButtonBase
            type="button"
            color="destructive"
            :disabled="isCancelMoveHouseReservationLoading"
            @click="handleReservationCancel"
          >
            {{
              isCancelMoveHouseReservationLoading ? '처리 중...' : '예약 취소'
            }}
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>
