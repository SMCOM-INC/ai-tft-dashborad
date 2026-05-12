<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TableView from '@components/common/TableView.vue';
  import { onMounted, ref, watch } from 'vue';

  import { PARKING_MILEAGE_DETAIL_TABLE_COLUMNS_LIST } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetMileageDetail from '@/lib/queries/parkingMileage/useGetMileageDetail.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';

  const { navigateTo } = useNavigate();

  const {
    mileageDetail,
    isMileageDetailLoading,
    isMileageDetailError,
    inMileageDetailError,
  } = useGetMileageDetail();

  const dongHo = ref(null);

  const renderFieldValue = (row, key) => {
    const value = row[key];

    if (key === 'inParkingDateTime' || key === 'outParkingDateTime') {
      return value.slice(0, 16);
    }

    return value || '-';
  };

  watch(isMileageDetailError, (newValue) => {
    if (newValue) {
      const { message } = inMileageDetailError.value.data.error;
      swalErrorModal({
        text: message,
        callback: () => navigateTo('/parking/notout-history'),
      });
    }
  });

  onMounted(() => {
    const { state } = window.history;
    if (state?.dong && state?.ho) {
      dongHo.value = { dong: state.dong, ho: state.ho };
    }
  });
</script>

<template>
  <section class="w-full p-8">
    <PageTitleBase
      title="마일리지 상세"
      has-back-button
      back-url="/parking/mileage"
    />
    <div>
      <h3 class="pb-3 pretendard-20SemiBold">
        {{ dongHo?.dong || '-' }}동 {{ dongHo?.ho || '-' }}호
      </h3>
      <TableView
        :column-data="PARKING_MILEAGE_DETAIL_TABLE_COLUMNS_LIST"
        :page-data="mileageDetail"
        :is-loading="isMileageDetailLoading"
        :is-error="isMileageDetailError"
        :error="inMileageDetailError"
        :show-count="true"
      >
        <template #default="{ row, column }">
          {{ renderFieldValue(row, column.key) }}
        </template>
      </TableView>
    </div>
  </section>
</template>
