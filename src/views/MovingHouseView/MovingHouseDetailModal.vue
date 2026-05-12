<script setup>
  import DoubleArrowIcon from '@assets/icons/icon-doubleArrow-left.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import MovingHouseCancelModal from '@views/MovingHouseView/MovingHouseCancelModal.vue';
  import MovingHouseConfirmModal from '@views/MovingHouseView/MovingHouseConfirmModal.vue';
  import MovingHouseEditModal from '@views/MovingHouseView/MovingHouseEditModal.vue';
  import { computed, ref } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useFetchMoveHouseReservationDetail } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const emits = defineEmits(['close']);

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const confirmModalRef = ref(false);
  const cancelModalRef = ref(false);
  const editModalRef = ref(false);

  // 이사 예약 상세 조회 (queryParams.detailUuid를 computed로 전달)
  const detailUuid = computed(() => queryParams.value.detailUuid);

  const { moveHouseReservationDetail, isMoveHouseReservationDetailLoading } =
    useFetchMoveHouseReservationDetail(aptUuid, detailUuid);

  const closeModal = () => {
    emits('close');
  };

  const handleCancelModalOpen = () => {
    cancelModalRef.value = true;
  };

  const handleConfirmModalOpen = () => {
    confirmModalRef.value = true;
  };

  const handleReservationConfirm = () => {
    // 확정 후 처리
    confirmModalRef.value = false;
  };

  const handleReservationCancel = () => {
    // 취소 후 처리
    cancelModalRef.value = false;
  };

  const handleReservationEdit = () => {
    // 수정 후 처리
    editModalRef.value = false;
  };

  // 예약 상태에 따른 버튼 표시 여부
  const showConfirmButton = computed(() => {
    const status = moveHouseReservationDetail.value?.moveReservationStatus;
    return status === 'WAITING' || status === 'CANCELED';
  });

  const showCancelButton = computed(() => {
    const status = moveHouseReservationDetail.value?.moveReservationStatus;
    return status === 'WAITING' || status === 'CONFIRMED';
  });

  // 예약상태 칩 색상
  const getStatusChipColor = (status) => {
    const colorMap = {
      WAITING: 'orange-10',
      CONFIRMED: 'blue-10',
      CANCELED: 'gray-10',
    };
    return colorMap[status] || 'gray-10';
  };

  // 예약상태 한글 텍스트
  const getStatusText = (status) => {
    const statusMap = {
      WAITING: '대기',
      CONFIRMED: '확정',
      CANCELED: '취소',
    };
    return statusMap[status] || status;
  };

  // 이사 유형 한글 텍스트
  const getMoveTypeText = (type) => {
    return type === 'MOVE_IN' ? '전입' : '전출';
  };
</script>

<template>
  <div
    class="fixed left-[0px] top-[0px] z-[999] flex h-screen w-screen items-start justify-end bg-black/50 p-5"
    @click="closeModal"
  >
    <div
      class="absolute flex h-[calc(100%-40px)] min-w-[400px] flex-col gap-5 rounded-br-md rounded-tr-md border bg-secondary-100"
      @click.stop
    >
      <!-- 제목 및 버튼 -->
      <div
        class="flex items-center justify-between rounded-tr-md border-b border-b-dark-100 bg-background-100 p-5"
      >
        <div class="flex items-center gap-2.5">
          <button type="button" @click="closeModal">
            <DoubleArrowIcon class="cursor-pointer" />
          </button>
          <h1 class="text-xl font-semibold leading-6">이사 접수내역 상세</h1>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div
        v-if="isMoveHouseReservationDetailLoading"
        class="flex h-full items-center justify-center"
      >
        <p class="text-sm text-gray-500">로딩 중...</p>
      </div>

      <!-- 상세 정보 -->
      <div
        v-else-if="moveHouseReservationDetail"
        class="flex flex-col gap-5 overflow-auto px-5 pb-5"
      >
        <!-- 이사 예약 정보 -->
        <div class="rounded-lg bg-white p-4">
          <h2 class="pb-4 text-muted-foreground-100">이사 예약 정보</h2>
          <ul class="flex flex-col gap-2">
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">이사 유형</div>
              <span>{{
                getMoveTypeText(moveHouseReservationDetail.moveType)
              }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">예약 상태</div>
              <ChipBase
                :color="
                  getStatusChipColor(
                    moveHouseReservationDetail.moveReservationStatus,
                  )
                "
              >
                {{
                  getStatusText(
                    moveHouseReservationDetail.moveReservationStatus,
                  )
                }}
              </ChipBase>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">동/호</div>
              <span
                >{{ moveHouseReservationDetail.dong }}동
                {{ moveHouseReservationDetail.ho }}호</span
              >
            </li>
            <li
              v-if="moveHouseReservationDetail.lineGroup"
              class="flex items-center"
            >
              <div class="w-[120px] font-semibold">라인 정보</div>
              <span>{{ moveHouseReservationDetail.lineGroup }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">이사 시작 시간</div>
              <span>{{
                formatDate(moveHouseReservationDetail.startDateTime).full()
              }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">이사 종료 시간</div>
              <span>{{
                formatDate(moveHouseReservationDetail.endDateTime).full()
              }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">신청일</div>
              <span>{{
                formatDate(moveHouseReservationDetail.createdDate).full()
              }}</span>
            </li>
          </ul>
        </div>

        <!-- 신청자 정보 -->
        <div class="rounded-lg bg-white p-4">
          <h2 class="pb-4 text-muted-foreground-100">신청자 정보</h2>
          <ul class="flex flex-col gap-2">
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">신청자명</div>
              <span>{{ moveHouseReservationDetail.residentName || '-' }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">비상 연락처</div>
              <span>{{
                formatContact(moveHouseReservationDetail.emergencyPhone)
              }}</span>
            </li>
            <li class="flex items-center">
              <div class="w-[120px] font-semibold">입금자명</div>
              <span>{{ moveHouseReservationDetail.depositorName || '-' }}</span>
            </li>
          </ul>
        </div>

        <!-- 예약 취소 및 확정 버튼 -->
        <div v-if="showCancelButton || showConfirmButton" class="flex gap-2">
          <ButtonBase
            v-if="showCancelButton"
            type="button"
            color="destructive-outlined"
            custom-class="w-full"
            @click="handleCancelModalOpen"
          >
            예약 취소
          </ButtonBase>
          <ButtonBase
            v-if="showConfirmButton"
            type="button"
            color="primary"
            custom-class="w-full"
            @click="handleConfirmModalOpen"
          >
            예약 확정
          </ButtonBase>
        </div>
      </div>

      <!-- 에러 상태 -->
      <div v-else class="flex h-full items-center justify-center">
        <p class="text-sm text-gray-500">예약 정보를 불러올 수 없습니다.</p>
      </div>
    </div>
  </div>

  <!-- 확정, 취소, 수정 모달 -->
  <MovingHouseConfirmModal
    v-if="confirmModalRef && queryParams.detailUuid"
    :move-reservation-uuid="queryParams.detailUuid"
    @confirm="handleReservationConfirm"
    @close="confirmModalRef = false"
  />
  <MovingHouseCancelModal
    v-if="cancelModalRef && queryParams.detailUuid"
    :move-reservation-uuid="queryParams.detailUuid"
    @cancel="handleReservationCancel"
    @close="cancelModalRef = false"
  />
  <MovingHouseEditModal
    v-if="editModalRef"
    @edit="handleReservationEdit"
    @close="editModalRef = false"
  />
</template>
