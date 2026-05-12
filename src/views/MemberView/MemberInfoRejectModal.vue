<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { watch } from 'vue';

  import { ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePatchResidentState from '@/lib/queries/member/usePatchResidentState.js';

  const emits = defineEmits(['close']);

  const { getParams } = useNavigate();

  const {
    patchResidentStateMutationAsync,
    isPatchResidentStatePending,
    isPatchResidentStateError,
  } = usePatchResidentState();

  const handleReject = async () => {
    await patchResidentStateMutationAsync({
      residentUuid: getParams().uuid,
      residentState: ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.REJECTED,
    });
    emits('close');
  };

  const closeModal = () => {
    emits('close');
  };

  watch(isPatchResidentStateError, (newValue) => {
    if (newValue) {
      closeModal();
    }
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">가입 신청을 반려 처리 하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          반려 이후 회원의 조치가 없으면, 회원 정보는 3개월 후 폐기됩니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isPatchResidentStatePending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isPatchResidentStatePending"
          @click="handleReject"
        >
          <SpinnerCircle v-if="isPatchResidentStatePending" class="mr-2" />
          <template v-else> 반려 처리 </template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
