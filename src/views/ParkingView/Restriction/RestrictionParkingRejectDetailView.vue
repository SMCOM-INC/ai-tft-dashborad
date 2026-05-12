<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import EmptyView from '@components/common/EmptyView.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { computed, ref } from 'vue';

  import { ADMIN_PARKING_RESTRICTIONS_REJECT_DETAIL_BASIC_INFO_LIST } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteReject from '@/lib/queries/parkingBlacklistReject/useDeleteReject.js';
  import useGetRejectDetail from '@/lib/queries/parkingBlacklistReject/useGetRejectDetail.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  // 거부 이력 삭제 모달 ref
  const modalParagraphRef = ref(null);
  const { getParams } = useNavigate();

  // URL 파라미터에서 거부 UUID 추출
  const rejectUuid = computed(() => {
    const params = getParams();
    return params.uuid || null;
  });

  // 주차 거부 상세 정보 조회
  const {
    rejectCarDetail,
    isRejectCarDetailLoading,
    isRejectCarDetailError,
    rejectCarDetailError,
  } = useGetRejectDetail(rejectUuid.value);

  // 거부 이력 삭제 mutation
  const {
    deleteRejectMutationAsync,
    isDeleteRejectPending,
    isDeleteRejectError,
    deleteRejectError,
  } = useDeleteReject();

  // 거부 이력 삭제 핸들러
  const handleDeleteRejectAction = async () => {
    await deleteRejectMutationAsync({
      rejectUuidList: [rejectUuid.value],
    });
  };
</script>

<template>
  <section class="w-full border-b border-b-dark-100 p-8">
    <ButtonBack />
    <div class="mb-6 flex justify-between">
      <h2 class="pretendard-h3">주차 거부 상세</h2>
    </div>
    <div v-if="isRejectCarDetailLoading">
      <SkeletonBar v-for="i in 3" :key="i" />
    </div>
    <ul v-if="rejectCarDetail" class="mt-6 flex flex-col gap-6">
      <li
        v-for="info in ADMIN_PARKING_RESTRICTIONS_REJECT_DETAIL_BASIC_INFO_LIST"
        :key="info.key"
        class="flex h-[22px] leading-[14px]"
      >
        <span class="w-[200px] font-semibold">
          {{ info.label }}
        </span>
        <span v-if="info.key === 'rejectCreatedDate'">
          {{ formatDate(rejectCarDetail[info.key]).full() }}
        </span>
        <span v-else>{{ rejectCarDetail[info.key] }}</span>
      </li>
    </ul>
    <span
      v-else-if="isRejectCarDetailError"
      class="text-pretendard-body-1 text-destructive-100"
    >
      주차거부 상세 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      <br />
      {{ rejectCarDetailError }}
    </span>
    <EmptyView v-else />
  </section>
  <section v-if="rejectCarDetail" class="w-full p-8">
    <ModalParagraph
      ref="modalParagraphRef"
      :error="deleteRejectError"
      :is-error="isDeleteRejectError"
      :is-loading="isDeleteRejectPending"
      close-button-name="삭제"
      color="red"
      icon="trash"
      paragraph="거부 이력을 삭제하면 해당 차량은 ‘일반 방문' 상태로 변경되며,
    해당 세대에서 마일리지가 차감됩니다."
      title="거부 이력을 삭제하시겠습니까?"
      trigger-button-name="거부 이력 삭제"
      @confirm="handleDeleteRejectAction"
    />
  </section>
</template>
