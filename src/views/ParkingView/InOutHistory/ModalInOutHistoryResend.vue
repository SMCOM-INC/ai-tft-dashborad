<script setup>
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import { computed, ref, watch } from 'vue';

  import {
    useGetInOutHistoryResendCount,
    usePostInOutHistoryResend,
  } from '@/lib/queries/aptAdmin/aptAdminResendQueries.js';

  defineProps({
    hideButton: { type: Boolean, required: false, default: false },
  });

  const {
    resendCountData,
    isInOutHistoryResendCountLoading,
    isInOutHistoryResendCountError,
    inOutHistoryResendCountError,
  } = useGetInOutHistoryResendCount();

  const { postResendMutation, isResendPending } = usePostInOutHistoryResend();

  const guardNetworkErrorCode = ref('');
  const inOutHistoryResendModalRef = ref(null);

  const triggerButtonName = computed(() => {
    if (guardNetworkErrorCode.value === 'GUARD_NETWORK_ERROR') {
      return '주차 서버가 오프라인입니다. 네트워크를 확인해주세요.';
    }

    return resendCountData?.value?.reSendCount > 0
      ? `주차 서버와 동기화가 필요한 입출차 데이터가 ${resendCountData.value.reSendCount}건 있습니다.`
      : '주차 서버와 동기화가 필요한 입출차 데이터가 없습니다.';
  });

  const buttonColor = computed(() =>
    resendCountData?.value?.reSendCount > 0 || !!guardNetworkErrorCode.value
      ? 'red'
      : 'green',
  );

  const handleRequestResend = () => {
    postResendMutation({ resendCount: resendCountData?.value?.reSendCount });
  };

  watch(isInOutHistoryResendCountError, (newValue) => {
    if (newValue) {
      guardNetworkErrorCode.value =
        inOutHistoryResendCountError.value?.data.error.errorCode;
    }
  });

  defineExpose({
    handleOpenModal: () => inOutHistoryResendModalRef.value?.handleOpenModal(),
  });
</script>

<template>
  <ModalParagraph
    ref="inOutHistoryResendModalRef"
    :hide-button="hideButton"
    :trigger-button-name="triggerButtonName"
    :title="'입출차 정보 동기화'"
    :paragraph="`주차 서버로부터 동기화가 필요한 정보가 ${resendCountData?.reSendCount}건 있습니다. 정확한 입출차 데이터를 위해 동기화를 진행해주세요.`"
    :color="buttonColor"
    icon="warning"
    submit-button-color="deepBlue"
    close-button-name="동기화하기"
    :close-button-handler="handleRequestResend"
    :is-loading="isInOutHistoryResendCountLoading || isResendPending"
    :disabled="
      resendCountData?.reSendCount === 0 ||
      guardNetworkErrorCode === 'GUARD_NETWORK_ERROR'
    "
  />
</template>
