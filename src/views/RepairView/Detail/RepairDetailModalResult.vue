<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import SelectBoxBase from '@components/common/SelectBoxBase.vue';
  import TableInfoBase from '@components/common/TableInfoBase.vue';
  import RepairDetailModalResultStateModal from '@views/RepairView/Detail/RepairDetailModalResultStateModal.vue';
  import RepairDetailModalResultVisitScheduleModal from '@views/RepairView/Detail/RepairDetailModalResultVisitScheduleModal.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import dayjs from 'dayjs';
  import { computed, ref, watch } from 'vue';

  import {
    REPAIR_ANSWER_CELL_COLUMN,
    REPAIR_STATUS_LIST,
  } from '@/constants/repair.js';
  import usePatchRepairState from '@/lib/queries/repair/usePatchRepairState.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    repairDetail: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });

  // 상태별 disabled 규칙
  const STATUS_DISABLED_RULES = {
    WAITING: (key) => key === 'WAITING',
    RECEIVED: (key) => key === 'RECEIVED',
    COMPLETED: (key) => key !== 'WAITING',
    IMPOSSIBLE: (key) => key === 'COMPLETED' || key === 'IMPOSSIBLE',
  };

  // 날짜 + 시간 객체를 문자열로 변환
  const formatVisitDateTime = (date, time) => {
    if (!date || !time) return null;
    return dayjs(date)
      .hour(time.hours)
      .minute(time.minutes)
      .second(time.seconds || 0)
      .format('YYYY-MM-DD HH:mm:ss');
  };

  // Date 객체를 시간 객체로 변환
  const dateToTimeObject = (date) => ({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  });

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  // 모달 상태
  const isStateModalOpen = ref(false);
  const isVisitScheduleModalOpen = ref(false);

  // 폼 상태
  const selectedStatus = ref(null);
  const originStatus = ref(null);
  const adminComment = ref('');
  const visitDate = ref(null);
  const visitTime = ref(null);
  const isEditingVisitSchedule = ref(false);

  // 접수상태 변경 mutation
  const {
    patchRepairStateMutationAsync,
    isPatchRepairStatePending,
    isPatchRepairStateSuccess,
    resetPatchRepairState,
  } = usePatchRepairState(aptUuid);

  // 선택 가능한 상태 옵션 목록
  const statusOptions = computed(() => {
    const rule = STATUS_DISABLED_RULES[originStatus.value] || (() => false);
    return REPAIR_STATUS_LIST.map((status) => ({
      ...status,
      disabled: rule(status.key),
    }));
  });

  // 현재 표시할 상태값
  const currentStatusValue = computed(
    () =>
      selectedStatus.value ||
      REPAIR_STATUS_LIST.find((item) => item.key === props.repairDetail.state),
  );

  // 상태가 변경되었는지 여부
  const isStateModified = computed(
    () =>
      selectedStatus.value !== null &&
      selectedStatus.value?.key !== originStatus.value,
  );

  // 선택된 상태 키
  const selectedKey = computed(() => selectedStatus.value?.key);

  // 접수완료 입력폼 표시 여부
  const showReceivedForm = computed(
    () =>
      selectedKey.value === 'RECEIVED' &&
      originStatus.value !== 'RECEIVED' &&
      originStatus.value !== 'COMPLETED',
  );

  // 처리불가 입력폼 표시 여부
  const showImpossibleForm = computed(
    () =>
      selectedKey.value === 'IMPOSSIBLE' &&
      selectedKey.value !== props.repairDetail.state,
  );

  // 컬럼 목록 생성
  const filteredAnswerColumnList = computed(() => {
    const findColumn = (key) =>
      REPAIR_ANSWER_CELL_COLUMN.find((item) => item.key === key);

    const columns = [findColumn('state')];
    const detail = props.repairDetail;
    const isWaiting = selectedKey.value === 'WAITING';

    if (!selectedStatus.value || !isWaiting) {
      if (detail.state !== 'IMPOSSIBLE' && detail.visitDateTime) {
        columns.push(findColumn('visitDateTime'));
      }
      if (detail.adminComment) {
        const adminCol = { ...findColumn('adminComment') };
        adminCol.label =
          detail.state === 'IMPOSSIBLE' ? '처리불가 사유' : '접수내용';
        columns.push(adminCol);
      }
    }

    return columns;
  });

  // 상태 변경 저장 모달 열기
  const openStateModal = () => {
    isStateModalOpen.value = true;
  };

  // 상태 변경 확정
  const handleStateChangeConfirm = () => {
    const state = selectedKey.value;
    const isWaiting = state === 'WAITING';

    patchRepairStateMutationAsync({
      repairUuid: props.repairDetail.uuid,
      state,
      visitDateTime: isWaiting
        ? null
        : formatVisitDateTime(visitDate.value, visitTime.value) ||
          props.repairDetail.visitDateTime,
      adminComment: isWaiting
        ? ''
        : adminComment.value || props.repairDetail.adminComment,
    });
  };

  // 방문예정일시 변경/저장 토글
  const toggleVisitScheduleEdit = () => {
    if (!isEditingVisitSchedule.value) {
      isEditingVisitSchedule.value = true;
    } else {
      isVisitScheduleModalOpen.value = true;
    }
  };

  // 방문예정일시 변경 확정
  const handleVisitScheduleConfirm = () => {
    if (!visitDate.value || !visitTime.value) {
      swalWarningModal({ title: '방문예정일시를 선택해 주세요.' });
      return;
    }

    patchRepairStateMutationAsync({
      repairUuid: props.repairDetail.uuid,
      state: originStatus.value,
      visitDateTime: formatVisitDateTime(visitDate.value, visitTime.value),
      adminComment: props.repairDetail.adminComment,
    });
  };

  // 방문예정일시 변경 취소
  const cancelVisitScheduleEdit = () => {
    visitDate.value = null;
    visitTime.value = null;
    isEditingVisitSchedule.value = false;
  };

  // 상태 초기화
  const resetFormState = () => {
    selectedStatus.value = null;
    adminComment.value = '';
    isEditingVisitSchedule.value = false;
  };

  // repairDetail 변경 시 초기화
  watch(
    () => props.repairDetail,
    (detail) => {
      if (detail) {
        resetFormState();
        originStatus.value = detail.state || null;
      }
    },
    { immediate: true },
  );

  // 방문예정일시 수정 모드 진입 시 기존 값 세팅
  watch(isEditingVisitSchedule, (isEditing) => {
    if (isEditing && props.repairDetail.visitDateTime) {
      const dt = new Date(props.repairDetail.visitDateTime);
      visitDate.value = dt;
      visitTime.value = dateToTimeObject(dt);
    }
  });

  // mutation 성공 시 폼 상태 초기화
  watch(isPatchRepairStateSuccess, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      resetFormState();
      resetPatchRepairState();
    }
  });
</script>

<template>
  <section class="relative flex flex-col gap-2 pt-5">
    <TableInfoBase
      title="접수 처리 내용"
      :column-count="1"
      :cell-column-list="filteredAnswerColumnList"
      :cell-data="repairDetail"
    >
      <template #tableData="{ row, column }">
        <!-- 접수상태 row -->
        <template v-if="column === 'state'">
          <div class="mb-2 flex w-[430px] items-center justify-start">
            <div class="-ml-1 mr-4 w-[200px]">
              <SelectBoxBase
                :option-list="statusOptions"
                :value="currentStatusValue"
                @select-value="(v) => (selectedStatus = v)"
              />
            </div>
            <ButtonBase
              type="button"
              :color="isStateModified ? 'primary' : 'secondary-fill'"
              :disabled="!isStateModified"
              @click="openStateModal"
            >
              저장
            </ButtonBase>
          </div>

          <!-- 접수완료 선택 시: 방문일시 + 전달사항 -->
          <div v-if="showReceivedForm" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 pt-2">
              <LabelBase
                label-for="visitDateTime"
                label-text="방문일시"
                asterisk
              />
              <div class="flex gap-2">
                <VueDatePicker
                  v-model="visitDate"
                  locale="ko"
                  :enable-time-picker="false"
                  auto-apply
                  format="yyyy.MM.dd"
                  placeholder="날짜 선택"
                />
                <VueDatePicker
                  v-model="visitTime"
                  locale="ko"
                  time-picker
                  auto-apply
                  placeholder="시간 선택"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2 pb-2">
              <LabelBase
                label-for="adminComment"
                label-text="전달사항"
                asterisk
              />
              <div class="relative">
                <textarea
                  id="adminComment"
                  v-model="adminComment"
                  maxlength="200"
                  name="adminComment"
                  placeholder="전달사항을 입력해 주세요."
                  class="h-24 w-full resize-none rounded-md border px-3 py-2 focus:border-blue-500"
                />
                <span class="absolute bottom-3 right-3 text-sm text-gray-500">
                  {{ adminComment?.length || 0 }}/200자
                </span>
              </div>
            </div>
          </div>

          <!-- 처리불가 선택 시: 사유 입력 -->
          <div v-if="showImpossibleForm" class="flex flex-col gap-2 py-2">
            <LabelBase
              label-for="adminComment"
              label-text="처리불가 사유"
              asterisk
            />
            <div class="relative">
              <textarea
                id="adminComment"
                v-model="adminComment"
                maxlength="200"
                name="adminComment"
                placeholder="처리불가 사유를 입력해 주세요."
                class="h-24 w-full resize-none rounded-md border px-3 py-2 focus:border-blue-500"
              />
              <span class="absolute bottom-3 right-3 text-sm text-gray-500">
                {{ adminComment?.length || 0 }}/200자
              </span>
            </div>
          </div>
        </template>

        <!-- 방문예정일시 row -->
        <template v-if="column === 'visitDateTime'">
          <div class="flex items-center gap-2">
            <template v-if="isEditingVisitSchedule">
              <div class="flex w-[364px] gap-2">
                <VueDatePicker
                  v-model="visitDate"
                  locale="ko"
                  :enable-time-picker="false"
                  auto-apply
                  format="yyyy.MM.dd"
                  placeholder="날짜 선택"
                />
                <VueDatePicker
                  v-model="visitTime"
                  locale="ko"
                  time-picker
                  auto-apply
                  placeholder="시간 선택"
                />
              </div>
            </template>
            <template v-else>
              {{ formatDate(row)?.full() }}
            </template>

            <ButtonBase
              v-if="isEditingVisitSchedule"
              type="button"
              color="secondary"
              @click="cancelVisitScheduleEdit"
            >
              취소
            </ButtonBase>
            <ButtonBase
              v-if="repairDetail.state === 'RECEIVED'"
              type="button"
              :color="isEditingVisitSchedule ? 'outlined' : 'secondary'"
              @click="toggleVisitScheduleEdit"
            >
              {{ isEditingVisitSchedule ? '저장' : '변경' }}
            </ButtonBase>
          </div>
        </template>

        <!-- 접수내용/처리불가 사유 row -->
        <template v-if="column === 'adminComment'">
          <p v-dompurify-html="decodeUrlToParagraph(row)" />
        </template>
      </template>
    </TableInfoBase>
  </section>

  <!-- 상태 변경 확인 모달 -->
  <RepairDetailModalResultStateModal
    v-if="isStateModalOpen"
    :is-loading="isPatchRepairStatePending"
    @close="isStateModalOpen = false"
    @submit="handleStateChangeConfirm"
  />

  <!-- 방문예정일시 변경 확인 모달 -->
  <RepairDetailModalResultVisitScheduleModal
    v-if="isVisitScheduleModalOpen"
    @close="isVisitScheduleModalOpen = false"
    @submit="handleVisitScheduleConfirm"
  />
</template>

<style scoped>
  .custom-date-picker {
    --dp-font-family: 'Pretendard', -apple-system, 'Segoe UI', roboto, oxygen,
      ubuntu, cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --dp-font-size: 14px !important;
    --dp-font-weight: 600 !important;
  }
  .custom-date-picker :deep(.dp__input) {
    line-height: calc(var(--dp-font-size) * 1.8) !important;
  }
</style>
