<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import RepairDetailModalContent from '@views/RepairView/Detail/RepairDetailModalContent.vue';
  import RepairDetailModalInfo from '@views/RepairView/Detail/RepairDetailModalInfo.vue';
  import RepairDetailModalResult from '@views/RepairView/Detail/RepairDetailModalResult.vue';

  import useGetRepairDetail from '@/lib/queries/repair/useGetRepairDetail.js';

  const props = defineProps({
    detailUuid: {
      type: String,
      required: true,
      default: '',
    },
  });

  const emits = defineEmits(['closeModal']);

  const { repairDetail, isRepairDetailLoading } = useGetRepairDetail(
    props.detailUuid,
  );

  const closeModal = () => {
    emits('closeModal');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="max-h-[80vh] w-[750px] overflow-auto rounded-lg bg-white p-6">
      <header class="mb-4 flex items-center justify-between">
        <h1 class="select-none text-lg font-medium">접수내역 상세</h1>
        <button type="button" class="w-fit" @click="closeModal">
          <CloseIcon class="h-5" aria-hidden="true" />
        </button>
      </header>

      <div v-if="isRepairDetailLoading" class="flex justify-center py-10">
        <SpinnerCircle color="blue" />
      </div>

      <template v-else-if="repairDetail">
        <!-- 접수정보 -->
        <RepairDetailModalInfo :repair-detail="repairDetail" />

        <!-- 접수내용 -->
        <RepairDetailModalContent :repair-detail="repairDetail" />

        <!-- 접수처리내용 -->
        <RepairDetailModalResult :repair-detail="repairDetail" />
      </template>
    </div>
  </ModalBaseNew>
</template>
