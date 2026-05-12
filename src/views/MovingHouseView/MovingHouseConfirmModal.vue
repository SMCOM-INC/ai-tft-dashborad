<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { computed, ref, watch } from 'vue';

  import {
    useConfirmMoveHouseReservation,
    useFetchMoveHouseReservationDetail,
  } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    moveReservationUuid: { type: String, required: true },
  });

  const emits = defineEmits(['close', 'confirm']);

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const depositDate = ref('');
  const depositorName = ref('');

  // 상세 조회에서 입금자명 가져오기
  const detailUuid = computed(() => props.moveReservationUuid);
  const { moveHouseReservationDetail } = useFetchMoveHouseReservationDetail(
    aptUuid,
    detailUuid,
  );

  const {
    confirmMoveHouseReservationMutation,
    isConfirmMoveHouseReservationLoading,
  } = useConfirmMoveHouseReservation(aptUuid);

  const closeModal = () => {
    emits('close');
  };

  const handleReservationConfirm = async () => {
    // 유효성 검사
    if (!depositorName.value || !depositorName.value.trim()) {
      swalErrorModal({
        text: '입금자명을 입력해주세요.',
      });
      return;
    }

    if (!depositDate.value) {
      swalErrorModal({
        text: '입금일을 선택해주세요.',
      });
      return;
    }

    try {
      await confirmMoveHouseReservationMutation({
        moveHouseReservationUuid: props.moveReservationUuid,
        data: {
          depositorName: depositorName.value,
          depositDate: formatDateObject(depositDate.value, 'hyphen'),
        },
      });

      swalSuccessModal({
        title: '예약이 확정되었습니다.',
      });

      emits('confirm');
      closeModal();
    } catch (error) {
      const message =
        error?.data?.error?.message || '예약 확정에 실패했습니다.';
      swalErrorModal({
        text: message,
      });
    }
  };

  // 상세 조회 데이터가 로드되면 입금자명 초기화
  watch(
    moveHouseReservationDetail,
    (newDetail) => {
      if (newDetail?.depositorName) {
        depositorName.value = newDetail.depositorName;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div
    class="fixed left-[0px] top-[0px] z-[1000] flex h-screen w-screen items-center justify-center bg-black/50 p-5"
    @click="closeModal"
  >
    <div class="absolute min-w-[400px] rounded-md bg-white" @click.stop>
      <h1 class="border-b border-b-[#E2E8F0] px-6 py-4 pretendard-h4">
        예약확정하기
      </h1>
      <div class="flex flex-col gap-6 p-6">
        <ul class="flex flex-col gap-2 rounded-lg bg-secondary-100 p-4">
          <li class="flex items-center gap-4">
            <div class="min-w-[60px]">입금자명</div>
            <input
              v-model="depositorName"
              type="text"
              placeholder="입금자명을 입력해주세요"
              class="focus:border-primary-500 h-[38px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            />
          </li>
          <li class="flex items-center gap-4">
            <span class="min-w-[60px]">입금일</span>
            <div class="w-full">
              <VueDatePicker
                v-model="depositDate"
                locale="ko"
                :enable-time-picker="false"
                auto-apply
                format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD"
                class="w-full"
              />
            </div>
          </li>
        </ul>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            custom-class="inline"
            @click="closeModal"
          >
            닫기
          </ButtonBase>
          <ButtonBase
            type="submit"
            color="primary"
            :disabled="isConfirmMoveHouseReservationLoading"
            @click="handleReservationConfirm"
          >
            {{
              isConfirmMoveHouseReservationLoading ? '처리 중...' : '예약 확정'
            }}
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>
