<script setup>
  import IconTrash from '@assets/icons/icon-trash-filled-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import TextError from '@components/common/TextError.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref } from 'vue';

  import {
    useAddMoveHouseHoliday,
    useDeleteMoveHouseHoliday,
    useFetchMoveHouseHolidayList,
  } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const { addMoveHouseHolidayMutation, isAddMoveHouseHolidayPending } =
    useAddMoveHouseHoliday(aptUuid);

  const { moveHouseHolidayList, isMoveHouseHolidayListLoading } =
    useFetchMoveHouseHolidayList(aptUuid);

  const { deleteMoveHouseHolidayMutation, isDeleteMoveHouseHolidayLoading } =
    useDeleteMoveHouseHoliday(aptUuid);

  const dateRef = ref('');
  const isError = ref('');

  const handleButtonAdd = async () => {
    if (dateRef.value === '') {
      isError.value = true;
      return;
    }

    try {
      // dateRef.value는 [startDate, endDate] 형태의 배열
      const [startDate, endDate] = dateRef.value;

      await addMoveHouseHolidayMutation({
        startDate: formatDateObject(startDate, 'hyphen'),
        endDate: formatDateObject(endDate, 'hyphen'),
      });

      // 성공 시 입력 필드 초기화 (리스트는 자동으로 refetch됨)
      dateRef.value = '';
      isError.value = false;
    } catch (error) {
      console.error('휴무일 추가 실패:', error);
      // 에러 처리는 필요에 따라 추가
    }
  };

  const handleButtonDelete = async (holidayUuid) => {
    try {
      await deleteMoveHouseHolidayMutation(holidayUuid);
    } catch (error) {
      console.error('휴무일 삭제 실패:', error);
    }
  };
</script>

<template>
  <div class="flex max-w-[350px] flex-col gap-4">
    <div class="border-border flex flex-col gap-2 border-b pb-4">
      <h3 class="font-bold">휴무기간 설정</h3>
      <div>
        <div class="flex gap-2">
          <VueDatePicker
            v-model="dateRef"
            locale="ko"
            range
            :enable-time-picker="false"
            auto-apply
            format="yyyy.MM.dd"
            placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
          />
          <ButtonBase
            type="button"
            color="secondary-fill"
            :disabled="isAddMoveHouseHolidayPending"
            custom-class="inline"
            @click="handleButtonAdd"
          >
            {{ isAddMoveHouseHolidayPending ? '추가 중...' : '추가' }}
          </ButtonBase>
        </div>
        <TextError v-if="isError">날짜를 선택해주세요.</TextError>
      </div>
      <p class="text-muted-foreground-100">
        휴무 기간으로 설정 시 해당일에는 이사 예약이 불가합니다.
      </p>
    </div>
    <div class="flex flex-col gap-2 bg-muted-50 p-3">
      <span class="rounded-md text-muted-foreground-100">적용중</span>
      <ul v-if="moveHouseHolidayList && moveHouseHolidayList.length > 0">
        <li
          v-for="holiday in moveHouseHolidayList"
          :key="holiday.uuid"
          class="flex items-center justify-between"
        >
          <span>{{ `${holiday.startDate} ~ ${holiday.endDate}` }}</span>
          <button
            type="button"
            :disabled="isDeleteMoveHouseHolidayLoading"
            @click="() => handleButtonDelete(holiday.uuid)"
          >
            <IconTrash class="h-4 w-4" />
          </button>
        </li>
      </ul>
      <p v-else-if="!isMoveHouseHolidayListLoading" class="py-4 text-center">
        적용중인 휴무일이 없습니다.
      </p>
      <p v-else class="py-4 text-center">로딩 중...</p>
    </div>
  </div>
</template>
