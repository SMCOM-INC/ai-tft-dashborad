<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import EmptyView from '@components/common/EmptyView.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import ModalInOutHistoryResend from '@views/ParkingView/InOutHistory/ModalInOutHistoryResend.vue';
  import { ref, watch } from 'vue';

  import { ADMIN_PARKING_IN_OUT_HISTORY_DETAIL_BASIC_INFO_LIST } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useGetInOutHistoryResendCount } from '@/lib/queries/aptAdmin/aptAdminResendQueries.js';
  import useDeleteInOutHistory from '@/lib/queries/parkingInoutHistory/useDeleteInOutHistory.js';
  import useGetInOutHistoryDetail from '@/lib/queries/parkingInoutHistory/useGetInOutHistoryDetail.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import findCarType from '@/lib/utils/findCarType.js';
  import findRegistType from '@/lib/utils/findRegistType.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const modalParagraphRef = ref(null);
  const inOutHistoryResendRef = ref(null);
  const { getParams, navigateTo } = useNavigate();

  // 입출차내역 상세조회 query
  const {
    inOutHistoryDetail,
    isInOutHistoryDetailLoading,
    isInOutHistoryDetailError,
    inOutHistoryDetailError,
  } = useGetInOutHistoryDetail();

  // 입출차내역 삭제 query
  const { deleteInOutHistoryMutationAsync, isDeleteInOutHistoryPending } =
    useDeleteInOutHistory();

  // 입출차재전송 조회 query
  const { resendCountData } = useGetInOutHistoryResendCount(aptUuid);

  // 입출차내역 삭제버튼 클릭
  const handleOutNotDeletionButton = () => {
    if (resendCountData?.value.reSendCount > 0) {
      inOutHistoryResendRef.value.handleOpenModal();
    } else {
      modalParagraphRef.value.handleOpenModal();
    }
  };

  // 입출차내역 삭제
  const deleteInOut = () => {
    deleteInOutHistoryMutationAsync({ uuid: getParams().uuid });
  };

  // 필드 표시 여부 판단
  const shouldShowField = (key) => {
    const registType = inOutHistoryDetail?.value?.registType;

    if (key === 'businessType' && registType === 'HOUSEHOLD') {
      return false;
    }

    if (key === 'visitPurpose' && registType === 'BUSINESS') {
      return false;
    }

    return true;
  };

  // 필드 값 렌더링
  const renderFieldValue = (key) => {
    const value = inOutHistoryDetail?.value[key];

    if (!key || !value || !inOutHistoryDetail?.value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'inParkingTime' || key === 'outParkingTime') {
      return formatDate(value).full();
    }

    if (key === 'parkingMinute') {
      return formatMinutes(value);
    }

    if (key === 'registType') {
      return findRegistType(value);
    }

    if (key === 'carType') {
      return findCarType(value);
    }

    return value || '-';
  };

  watch(isInOutHistoryDetailError, (newValue) => {
    if (newValue) {
      const { message } = inOutHistoryDetailError.value.data.error;
      swalErrorModal({
        text: message,
        callback: () => navigateTo('/parking/inout-history'),
      });
    }
  });
</script>

<template>
  <section
    v-if="!isInOutHistoryDetailLoading"
    class="w-full border-b border-b-dark-100 p-8"
  >
    <ButtonBack />
    <div class="mb-6 flex items-start justify-between">
      <h2 class="pretendard-h3">입출차 상세</h2>
      <div class="flex justify-end">
        <ButtonBase
          type="submit"
          color="destructive-outlined"
          size="md"
          @click="handleOutNotDeletionButton"
        >
          입출차 삭제
        </ButtonBase>

        <!-- 입출차 삭제 모달 -->
        <ModalParagraph
          ref="modalParagraphRef"
          :close-button-handler="deleteInOut"
          :disabled="isDeleteInOutHistoryPending"
          :is-loading="isDeleteInOutHistoryPending"
          close-button-name="삭제 처리"
          color="red"
          hide-button
          paragraph="삭제 후 복구될 수 없습니다."
          title="입출차 내역을 삭제 처리하시겠습니까?"
          trigger-button-name="입출차 삭제"
        />
        <!-- 입출차 데이터 재전송 모달 -->
        <ModalInOutHistoryResend ref="inOutHistoryResendRef" hide-button />
      </div>
    </div>
    <ul v-if="inOutHistoryDetail">
      <div v-if="inOutHistoryDetail" class="flex gap-6 text-sm font-normal">
        <li class="flex flex-col gap-2">
          <ChipBase color="green-10" variant="fill">입차</ChipBase>
          <div
            v-if="inOutHistoryDetail.inParkingImageUrl"
            class="h-[224px] w-[360px]"
          >
            <img
              :src="getFullImageUrl(inOutHistoryDetail.inParkingImageUrl)"
              alt="입차 사진"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-[224px] w-[360px] items-center justify-center bg-gray-200"
          >
            <span class="text-gray-500">차량 이미지 없음</span>
          </div>
        </li>
        <li class="flex flex-col gap-2">
          <ChipBase color="blue-10" variant="fill">출차</ChipBase>
          <div
            v-if="inOutHistoryDetail.outParkingImageUrl"
            class="h-[224px] w-[360px]"
          >
            <img
              :src="getFullImageUrl(inOutHistoryDetail.outParkingImageUrl)"
              alt="출차 사진"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-[224px] w-[360px] items-center justify-center bg-gray-200"
          >
            <span class="text-gray-500">차량 이미지 없음</span>
          </div>
        </li>
      </div>
      <div class="mt-6 flex flex-col gap-6">
        <li
          v-for="info in ADMIN_PARKING_IN_OUT_HISTORY_DETAIL_BASIC_INFO_LIST"
          v-show="shouldShowField(info.key)"
          :key="info.key"
          class="flex h-[22px] leading-[14px]"
        >
          <span class="w-[200px] font-semibold">{{ info.label }}</span>
          <span>{{ renderFieldValue(info.key) }}</span>
        </li>
      </div>
    </ul>
    <EmptyView v-else />
  </section>
</template>
