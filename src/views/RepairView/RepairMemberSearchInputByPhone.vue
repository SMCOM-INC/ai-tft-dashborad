<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';
  import * as z from 'zod';

  import useGetResidentListByPhone from '@/lib/queries/repair/useGetResidentListByPhone.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import { getMemberInfoByPhoneSchema } from '@/schemas/repair.js';

  const emit = defineEmits(['memberDetail', 'reset']);

  const { values, handleSubmit, resetForm } = useForm();

  const errors = ref({});

  const {
    residentListByPhone,
    isResidentListByPhoneLoading,
    isError,
    error,
    refetchMemberDetail,
  } = useGetResidentListByPhone();

  const onSubmit = handleSubmit((submitValues) => {
    try {
      getMemberInfoByPhoneSchema.parse({ phone: submitValues.memberPhone });
      refetchMemberDetail(submitValues.memberPhone);
    } catch (err) {
      if (err instanceof z.ZodError) {
        swalErrorModal({
          title: '입력한 정보가 올바르지 않습니다.',
          text: err.errors[0].message,
        });
      }
    }
  });

  const resetPhoneForm = () => {
    resetForm();

    const input = document.getElementById('memberPhone');
    if (input) {
      input.value = '';
      input.focus();
      input.dispatchEvent(new Event('input'));
    }
    emit('reset');
  };

  watch(residentListByPhone, (newMemberDetail) => {
    emit('memberDetail', { phone: values.memberPhone, newMemberDetail });
  });

  watch(isError, (newIsError) => {
    if (newIsError) {
      const errorCode = error.value?.data?.error?.errorCode;
      const errorMessage =
        errorCode === 'RESIDENT_NOT_FOUND'
          ? '등록되지 않은 연락처입니다.'
          : error.value?.data?.error?.message ||
            '입주민 정보 조회 중 오류가 발생했습니다.';
      swalErrorModal({
        title: '입주민 조회 실패',
        text: errorMessage,
      });
      resetPhoneForm();
    }
  });
</script>

<template>
  <form
    id="memberPhoneForm"
    class="flex w-full flex-nowrap items-end gap-2"
    @submit="onSubmit"
  >
    <div class="w-1/2">
      <ModalFieldPhone
        id="memberPhone"
        :errors="errors"
        :disabled="
          isResidentListByPhoneLoading ||
          residentListByPhone?.aptResidentUuid !== undefined
        "
        label-text="연락처"
      />
    </div>
    <ButtonBase
      form="memberPhoneForm"
      type="submit"
      custom-class="w-auto"
      :color="
        !values.memberPhone || values.memberPhone?.length <= 0
          ? 'secondary-fill'
          : 'primary'
      "
      :disabled="
        isResidentListByPhoneLoading || values.memberPhone?.length <= 0
      "
    >
      <div
        v-if="isResidentListByPhoneLoading"
        class="flex items-center justify-center gap-2"
      >
        <span>검색 중..</span>
        <SpinnerWhiteView />
      </div>
      <div v-else-if="residentListByPhone" class="w-full" @click="resetForm">
        새로 검색
      </div>
      <div v-else class="w-full">검색</div>
    </ButtonBase>
  </form>
</template>
