<script setup>
  import IconTrash from '@assets/icons/icon-trash-filled-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref } from 'vue';

  import {
    useDeleteFreeParkingDate,
    useFetchFreeParkingDateList,
    usePostFreeParkingDate,
  } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';

  const freeParkingDate = ref(undefined);

  const { freeParkingDateList, isFreeParkingDateListLoading } =
    useFetchFreeParkingDateList();

  const { postFreeParkingDateMutation, isAddFreeParkingDatePending } =
    usePostFreeParkingDate();

  const { deleteFreeParkingDateMutationAsync } = useDeleteFreeParkingDate();

  // 미차감 기간 추가
  const addFreeMileageDate = () => {
    if (!freeParkingDate.value) return;

    const [freeParkingStartDate, freeParkingEndDate] = freeParkingDate.value;

    // 기존 기간과 중복 확인
    const isOverlapping = freeParkingDateList.value.some((existingPeriod) => {
      const existingStartDate = existingPeriod.freeParkingStartDate;
      const existingEndDate = existingPeriod.freeParkingEndDate;

      // 문자열 날짜를 비교 가능한 타임스탬프로 변환
      const newStartDate = formatDateObject(freeParkingStartDate, 'hyphen');
      const newEndDate = formatDateObject(freeParkingEndDate, 'hyphen');

      return (
        // 새 기간의 시작일이 기존 기간 내에 있는 경우
        (newStartDate >= existingStartDate &&
          newStartDate <= existingEndDate) ||
        // 새 기간의 종료일이 기존 기간 내에 있는 경우
        (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
        // 새 기간이 기존 기간을 완전히 포함하는 경우
        (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
      );
    });

    // 중복된 기간이 있으면 오류 표시
    if (isOverlapping) {
      swalErrorModal({
        title: '미차감 기간이 중복됩니다.',
        text: '미차감 기간이 중복되지 않게 선택해주세요.',
      });
      return;
    }

    postFreeParkingDateMutation({
      freeParkingStartDate: formatDateObject(freeParkingStartDate, 'hyphen'),
      freeParkingEndDate: formatDateObject(freeParkingEndDate, 'hyphen'),
    });

    // 입력 필드 초기화
    freeParkingDate.value = null;
  };

  // 미차감 기간 삭제
  const deleteFreeMileageDate = (dateUuid) => {
    swalConfirmModal({
      title: '미차감 기간 삭제',
      text: '미차감 기간을 삭제하시겠습니까?',
      icon: 'warning',
      confirmButtonText: '예',
      cancelButtonText: '아니오',
      callback: async () => {
        await deleteFreeParkingDateMutationAsync(dateUuid);
        freeParkingDate.value = null;
      },
    });
  };
</script>

<template>
  <div class="w-[350px] space-y-4 pt-8">
    <!-- 제목 및 문구 -->
    <div>
      <h3 class="font-medium">마일리지 미차감 기간</h3>
      <p class="text-muted-foreground-100">
        설정된 기간 동안 마일리지 차감이 되지 않습니다.
      </p>
    </div>
    <!-- 기간 선택 date picker -->
    <div class="flex gap-2 border-b border-dark-100 pb-4">
      <VueDatePicker
        v-model="freeParkingDate"
        range
        locale="ko"
        :min-date="new Date()"
        :enable-time-picker="false"
        auto-apply
        placeholder="미차감 기간"
        format="yyyy.MM.dd"
      />
      <ButtonBase
        type="button"
        color="secondary-fill"
        :disabled="freeParkingDate === undefined || isAddFreeParkingDatePending"
        custom-class="flex items-center gap-3"
        @click="addFreeMileageDate"
      >
        <SpinnerCircle
          v-if="isAddFreeParkingDatePending"
          color="black"
          class="flex"
        />
        <template v-else>추가</template>
      </ButtonBase>
    </div>
    <!-- 기간 리스트 -->
    <div class="mt-4 rounded-md bg-muted-100 px-3 py-4">
      <div v-if="isFreeParkingDateListLoading" class="flex justify-center">
        <SpinnerCircle color="blue" />
      </div>
      <div
        v-else-if="freeParkingDateList <= 0"
        class="my-2 flex w-full justify-center italic text-muted-foreground-100"
      >
        적용된 마일리지 미차감 기간이 없습니다.
      </div>
      <ul v-else class="flex flex-col gap-2">
        <li
          v-for="date in freeParkingDateList"
          :key="date.startDate"
          class="flex justify-between"
        >
          <span class="text-sm"
            >{{ date.freeParkingStartDate }} ~
            {{ date.freeParkingEndDate }}</span
          >
          <button type="button" @click="deleteFreeMileageDate(date.uuid)">
            <IconTrash class="h-4 w-4" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
