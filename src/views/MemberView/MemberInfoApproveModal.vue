<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { watch } from 'vue';

  import { ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES } from '@/constants/member.js';
  import useGetResidentNameDuplicationCheck from '@/lib/queries/member/useGetResidentNameDuplicationCheck.js';
  import usePatchResidentState from '@/lib/queries/member/usePatchResidentState.js';

  const emits = defineEmits(['close']);

  const {
    patchResidentStateMutationAsync,
    isPatchResidentStatePending,
    isPatchResidentStateError,
  } = usePatchResidentState();

  const {
    residentNameDuplicationCheck,
    isResidentNameDuplicationCheckLoading,
    isResidentNameDuplicationCheckError,
  } = useGetResidentNameDuplicationCheck();

  const closeModal = () => {
    emits('close');
  };

  const handleApprove = async () => {
    await patchResidentStateMutationAsync({
      residentState: ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.APPROVED,
    });

    closeModal();
  };

  watch(isPatchResidentStateError, (newValue) => {
    if (newValue) {
      closeModal();
    }
  });

  watch(
    isResidentNameDuplicationCheckError,
    (newValue) => {
      if (newValue) {
        closeModal();
      }
    },
    { immediate: true },
  );
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div
        v-if="isResidentNameDuplicationCheckLoading"
        class="flex items-center justify-center py-10"
      >
        <SpinnerCircle class="mr-2 flex" color="blue" />
      </div>
      <p
        v-else-if="isResidentNameDuplicationCheckError"
        class="py-5 font-semibold text-alerts-error-text-error"
      >
        오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <template v-else>
        <!-- 중복있을 때  -->
        <div
          v-if="residentNameDuplicationCheck"
          class="mb-4 flex flex-col gap-2"
        >
          <p class="pretendard-18Medium">
            세대 내
            <span class="font-semibold text-alerts-error-text-error"
              >중복되는 이름</span
            >을 가진 회원이 존재합니다.
          </p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            가입 신청을 승인 처리 하시겠습니까? <br />
            승인 처리 이후에는 앱의 모든 기능을 사용할 수 있습니다.
          </p>
        </div>
        <!-- 중복없을 때  -->
        <div v-else class="mb-4 flex flex-col gap-2">
          <p class="pretendard-18Medium">가입 신청을 승인 처리 하시겠습니까?</p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            승인 처리 이후에는 앱의 모든 기능을 사용할 수 있습니다.
          </p>
        </div>
      </template>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          :color="`${isResidentNameDuplicationCheckError ? 'secondary' : 'outlined'}`"
          size="md"
          :disabled="isPatchResidentStatePending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          v-if="!isResidentNameDuplicationCheckError"
          type="button"
          color="primary"
          size="md"
          :disabled="isPatchResidentStatePending"
          class="flex"
          @click="handleApprove"
        >
          <SpinnerCircle v-if="isPatchResidentStatePending" class="mr-2" />
          <template v-else>가입 승인 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
