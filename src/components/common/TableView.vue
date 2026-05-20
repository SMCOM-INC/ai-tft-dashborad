<script setup>
  import ChevronRightIcon from '@assets/icons/icon-chevron-right-white.svg';
  import ButtonKebab from '@components/common/ButtonKebab.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import PaginationBase from '@components/common/PaginationBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';
  import formatNumber from '@/lib/utils/formatNumber.js';

  const props = defineProps({
    columnData: { type: Array, required: true },
    pageData: { type: Object, required: false, default: undefined },
    selectable: { type: Boolean, default: false },
    isSingleSelect: { type: Boolean, default: false },
    hasChild: { type: Boolean, default: false },
    pageable: { type: Boolean, default: true },
    showCount: { type: Boolean, default: false },
    fixedHeight: { type: Boolean, default: false },
    kebabOptions: { type: Array, required: false, default: () => [] },
    rowFunction: { type: Function, required: false, default: undefined },
    emptyPlaceholderText: {
      type: String,
      required: false,
      default: '데이터가 존재하지 않습니다',
    },
    bulkActionFlag: {
      type: Boolean,
      required: false,
      default: false,
    },
    bulkActionButtons: {
      type: Array,
      required: false,
      default: () => [],
    },
    isLoading: { type: Boolean, default: false },
    skeletonLines: { type: Number, default: 4 },
    isError: { type: Boolean, default: false },
    error: { type: Object, default: undefined },
  });
  const emit = defineEmits(['bulkAction']);
  // AI 콜센터 전용 빌드 — 도메인 의존성 stub
  const CHIP_TYPE_COLUMNS = [];
  const REGULAR_CAR_TYPE = [];
  const findCarType = () => '';
  const findRegistType = () => '';

  const route = useRoute();
  const router = useRouter();

  const selectedRows = ref([]);
  const selectedRowIndex = ref(null);
  const isAllSelected = ref(false);
  const menuContainer = ref(null);
  const rowsData = ref(props.pageData?.content || []);
  const numberOfElements = computed(() => props.pageData?.content?.length ?? 0);

  const paginationData = reactive({
    totalPages: props.pageData?.totalPages ?? 1,
    totalElements: props.pageData?.totalElements ?? 0,
    numberOfElements: props.pageData?.numberOfElements ?? 0,
    page: props.pageData?.page ?? 0,
    size: props.pageData?.size ?? 10,
  });

  const findRegularType = (key) => {
    const finedType = REGULAR_CAR_TYPE.find((type) => type.key === key);
    return finedType?.label;
  };

  // 아이템 번호 계산
  watch(selectedRows, () => {
    const contentLength = props.pageData?.content?.length ?? 0;
    isAllSelected.value =
      contentLength > 0 && selectedRows.value.length === contentLength;
  });

  const getRowNumber = (index) => {
    // 최신 아이템이 1번 부터 과거 순으로 증가
    // return (props.pageData?.page ?? 0) * (props.pageData?.size ?? 0) + index + 1;

    // 최신 아이템이 총 개수 부터 과거 순으로 감소
    if (props.pageData?.page || props.pageData?.size) {
      const totalElements = props.pageData?.totalElements ?? 0;
      const currentPage = props.pageData?.page ?? 0;
      const pageSize = props.pageData?.size ?? 0;
      return totalElements - (currentPage * pageSize + index);
    }
    const contentLength = props.pageData?.content?.length ?? 0;
    return contentLength - index;
  };

  const getRowClass = (rowIndex) => {
    const isLastRow =
      numberOfElements.value - 1 === rowIndex ||
      rowsData.value.length - 1 === rowIndex;
    const isSelected =
      props.isSingleSelect && selectedRowIndex.value === rowIndex;

    return {
      'h-[55px] cursor-pointer': true,
      'hover:bg-secondary-80': !isSelected,
      'bg-primary-100': isSelected,
      'hover:bg-primary-200': isSelected,
      'border-b border-dark-100': !isSelected && !isLastRow,
      'text-white font-medium': isSelected,
    };
  };

  /*
컬럼 유형:
text: 일반 텍스트
number: (천단위 구분 포함)
date: 'yyyy-mm-dd'
dateTime: 'yyyy-mm-dd hh:mm'
fullDateTime: 'yyyy-mm-dd hh:mm:ss'
parkingUsageTime: (0일 0시간 0분)
currency: (0원)
useFlag: (사용여부)
contentList: (서비스 목록)
registType: (세대(HOUSEHOLD)/상가(STORE)/업무(BUSINESS))
regularCarType: (입주민 차량 (RESIDENT)/정기차량(REGULAR))
carType: (정기차량, 입주민, 방문예약, 항상허용, 일반방문, 미확인, 거부, 블랙리스트, 회차)
postVisibilityStatus: (노출/숨김)
householdHeadFlag: (세대주/세대원)
approvalState: (대기/승인/반려)
inParkingFlag: (입차/미입차)
refundableFlag: (yyyy-mm-dd hh:mm:ss 환불처리, 환불버튼)
purchaseHistoryType: (환불/충전)
noticeType: (일반/필독/아파트먼트 공지)
noticeCategory: (공지사항 카테고리)
complaintStatus: (민원 접수 상태)
authorText: (작성자 이름)
*/

  const formatCellValue = (column, row) => {
    switch (column.type) {
      case 'number':
        return formatNumber(row?.[column?.key]);
      case 'currency':
        return formatNumber(row?.[column?.key], { unit: '원' });
      case 'residentCount':
        return formatNumber(row?.[column?.key], { unit: '명' });
      case 'date':
        return formatDate(row?.[column?.key]).date();
      case 'dateTime':
        return formatDate(row?.[column?.key]).full();
      case 'fullDateTime':
        return formatDate(row?.[column?.key]).time();
      case 'usageTime':
        return formatMinutes(row?.[column?.key]);
      case 'phone':
        return formatContact(row?.[column?.key]);
      case 'householdHeadFlag':
        return row?.type === 'HEAD' || row?.residentType === 'HEAD'
          ? '세대주'
          : '세대원';
      case 'carType':
        return findCarType(row?.carType);
      case 'registType':
        return findRegistType(row?.registType);
      case 'regularCarType':
        return findRegularType(row?.regularCarType);
      case 'inParkingFlag':
        return row?.inParkingFlag ? '입차' : '미입차';

      case 'memo':
      case 'title':
        return decodeUrl(row?.[column?.key]);
      default:
        return row?.[column?.key];
    }
  };

  const getChipColor = (column, row) => {
    // 입차 여부
    if (column.key === 'inParkingFlag') {
      return row?.inParkingFlag ? 'blue-100' : 'gray-100';
    }

    // 거절 해제 요청
    if (column.key === 'releaseRequest') {
      return row?.state === 'REJECT' ? 'gray-20' : 'red-100';
    }

    // 공지사항 유형
    if (column.key === 'noticeType') {
      return row?.noticeType === 'IMPORTANT' ? 'red-100' : 'blue-100';
    }

    // 기본 chip 색상
    if (CHIP_TYPE_COLUMNS.includes(column.key)) {
      return 'blue-100';
    }

    return 'blue-10';
  };

  const getChipVariant = (column) => {
    if (column.type === 'complaintStatus' || column.key === 'inParkingFlag') {
      return 'fill';
    }
    return 'outline';
  };

  // 체크박스 > 개별선택/해제
  const handleCheckboxChange = (isChecked, rowIndex) => {
    if (props.isSingleSelect) {
      if (selectedRows.value.includes(rowIndex)) {
        selectedRows.value = [];
        selectedRowIndex.value = null;
      } else {
        selectedRows.value = [rowIndex];
        selectedRowIndex.value = rowIndex;
      }
    } else if (isChecked) {
      selectedRows.value = [...selectedRows.value, rowIndex];
    } else {
      selectedRows.value = selectedRows.value.filter(
        (selectedRow) => selectedRow !== rowIndex,
      );
    }
  };

  // 체크박스 > 전체선택/해제
  const handleCheckboxAllChange = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      selectedRows.value = rowsData.value.map((_, index) => index);
    } else {
      selectedRows.value = [];
    }
    isAllSelected.value = isChecked;
  };

  // 체크박스 > 행 클릭 시 선택/해제
  const handleRowClick = (rowIndex, event) => {
    if (event.target.type === 'checkbox') {
      return;
    }

    const selectedRowData = rowsData.value[rowIndex];

    if (props.isSingleSelect) {
      selectedRowIndex.value = rowIndex;
      selectedRows.value = [];
      selectedRows.value[0] = rowIndex;

      if (props.rowFunction) {
        props.rowFunction(selectedRowData);
      }
    } else if (props.selectable && !props.rowFunction) {
      const hasRowIndex = selectedRows.value.includes(rowIndex);
      handleCheckboxChange(!hasRowIndex, rowIndex);
    } else if (props.rowFunction) {
      props.rowFunction(selectedRowData);
    }
  };

  const handleCell = (event, column) => {
    if (column.key === 'button') {
      event.stopPropagation();
    }
  };

  const handlePageChange = (newPage) => {
    const currentSize =
      paginationData.value?.pageable?.pageSize || props.pageData?.size || 10;
    router.push({
      query: {
        ...route.query,
        page: newPage.toString(),
        size: currentSize.toString(),
      },
    });
  };

  const handleSizeChange = (newSize) => {
    router.push({
      query: {
        ...route.query,
        size: newSize.toString(),
        page: '0',
      },
    });
  };

  const handleBulkAction = (action) => {
    const selectedRowData = selectedRows.value.map(
      (rowIndex) => rowsData.value[rowIndex],
    );
    emit('bulkAction', {
      action,
      selectedRows: JSON.parse(JSON.stringify(selectedRowData)),
    });
  };

  watch(
    () => props.pageData,
    (newPageData, oldPageData) => {
      if (newPageData) {
        // 변경된 데이터가 들어왔을 경우 선택 체크 해제
        if (
          JSON.stringify(newPageData.content) !==
          JSON.stringify(oldPageData?.content)
        ) {
          rowsData.value = newPageData.content || [];
          selectedRows.value = [];
          selectedRowIndex.value = null;
        }

        // 페이지네이션 데이터 업데이트
        paginationData.totalPages = newPageData.totalPages ?? 1;
        paginationData.totalElements = newPageData.totalElements ?? 0;
        paginationData.numberOfElements = newPageData.content?.length ?? 0;
        paginationData.page = newPageData.page ?? 0;
        paginationData.size = newPageData.size ?? 10;
      }
    },
    { immediate: true, deep: true },
  );
</script>

<template>
  <div
    :class="[
      'mb-5 w-full overflow-auto whitespace-nowrap rounded-md border',
      fixedHeight ? 'h-[610px]' : 'max-h-[610px]',
    ]"
  >
    <table class="w-full overflow-auto">
      <thead class="sticky -top-px z-10 bg-secondary-solid-80">
        <tr class="border-b border-dark-100">
          <th
            v-if="props.selectable"
            class="flex h-[55px] w-12 items-center justify-center"
          >
            <input
              type="checkbox"
              :checked="isAllSelected"
              class="h-4 w-4"
              @change="handleCheckboxAllChange"
            />
          </th>
          <th
            v-if="props.showCount"
            class="h-[55px] overflow-hidden px-4 text-left text-sm font-medium leading-5 text-muted-foreground-100"
          >
            번호
          </th>
          <th
            v-for="(column, colIndex) in props.columnData"
            :key="`column-${colIndex}`"
            class="h-[55px] overflow-hidden px-4 text-left text-sm font-medium leading-5 text-muted-foreground-100"
          >
            {{ column.name }}
          </th>
          <th v-if="props.kebabOptions"></th>
        </tr>
      </thead>
      <tbody class="relative">
        <template v-if="rowsData.length > 0 && !isLoading">
          <tr
            v-for="(row, rowIndex) in rowsData"
            :key="`row-${rowIndex}`"
            :class="getRowClass(rowIndex)"
            @click="(event) => handleRowClick(rowIndex, event)"
          >
            <td
              v-if="props.selectable"
              class="flex h-[54px] w-12 items-center justify-center p-0"
            >
              <input
                type="checkbox"
                class="h-4 w-4"
                :checked="selectedRows.includes(rowIndex)"
                @change="
                  (event) =>
                    handleCheckboxChange(event.target.checked, rowIndex)
                "
              />
            </td>
            <td
              v-if="props.showCount"
              class="px-4 text-sm font-medium text-muted-foreground-100"
            >
              {{ getRowNumber(rowIndex) }}
            </td>
            <!--
              whitespace-normal : 기본 줄바꿈 허용
              break-words:	긴 단어도 자동 줄바꿈
              max-w-[350px]:	컬럼 최대 너비 제한
              필요 시 아래 class에 해당 코드 추가할 것 : break-words whitespace-normal max-w-[350px]
            -->
            <td
              v-for="(column, colIndex) in props.columnData"
              :key="`cell-${rowIndex}-${colIndex}`"
              class="px-4 text-sm"
              @click="(event) => handleCell(event, column)"
            >
              <slot :row="row" :column="column">
                <ChipBase
                  v-if="CHIP_TYPE_COLUMNS.includes(column.key)"
                  :color="getChipColor(column, row)"
                  :variant="getChipVariant(column)"
                  class="w-fit"
                >
                  {{ formatCellValue(column, row) }}
                </ChipBase>
                <span
                  v-else
                  :class="
                    !formatCellValue(column, row) ||
                    typeof formatCellValue(column, row) === 'undefined'
                      ? 'text-muted-foreground-50'
                      : ''
                  "
                >
                  {{ formatCellValue(column, row) || '-' }}
                </span>
              </slot>
            </td>
            <td
              v-if="
                props.isSingleSelect &&
                selectedRowIndex === rowIndex &&
                props.hasChild
              "
              class="w-8"
            >
              <span>
                <ChevronRightIcon class="h-3" aria-hidden="true" />
              </span>
            </td>
            <td v-else-if="props.isSingleSelect"></td>
            <td
              v-if="props.kebabOptions.length > 0"
              ref="menuContainer"
              class="relative flex h-[52px] w-10 items-center justify-center"
              @click.stop
            >
              <ButtonKebab :button-list="props.kebabOptions" :row-data="row" />
            </td>
          </tr>
        </template>
        <template v-else-if="rowsData.length > 0 && isLoading">
          <tr>
            <td
              :colspan="
                props.columnData.length +
                (props.selectable ? 1 : 0) +
                (props.showCount ? 1 : 0) +
                (props.kebabOptions.length > 0 ? 1 : 0)
              "
            >
              <div class="m-4 space-y-2">
                <SkeletonBar v-for="i in skeletonLines" :key="i" :columns="1" />
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <template v-if="isLoading">
            <tr>
              <td
                :colspan="
                  props.columnData.length +
                  (props.selectable ? 1 : 0) +
                  (props.showCount ? 1 : 0) +
                  (props.kebabOptions.length > 0 ? 1 : 0)
                "
              >
                <div class="m-4 space-y-2">
                  <SkeletonBar
                    v-for="i in skeletonLines"
                    :key="i"
                    :columns="1"
                  />
                </div>
              </td>
            </tr>
          </template>
          <tr v-else-if="isError" class="h-[55px]">
            <td
              :colspan="
                props.columnData.length +
                (props.selectable ? 1 : 0) +
                (props.showCount ? 1 : 0) +
                (props.kebabOptions.length > 0 ? 1 : 0)
              "
            >
              <p class="my-4 text-center text-red-500">
                데이터 로딩 중 오류가 발생했습니다.
                {{
                  error?.response?.data?.error?.message
                    ? `(${error.data.error.message})`
                    : ''
                }}
                <br />
                {{ error?.response?.data?.error?.errorCode }}
                {{
                  error?.response?.status ? `(${error.response.status})` : ''
                }}
              </p>
            </td>
          </tr>
          <tr v-else class="h-[55px]">
            <td
              :colspan="
                props.columnData.length +
                (props.selectable ? 1 : 0) +
                (props.showCount ? 1 : 0) +
                (props.kebabOptions.length > 0 ? 1 : 0)
              "
            >
              <p class="text-center font-medium text-muted-foreground-100">
                {{ emptyPlaceholderText }}
              </p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <PaginationBase
    v-if="pageable && rowsData.length > 0"
    :pagination-data="paginationData"
    :selectable="props.selectable"
    :selected-rows-count="props.selectable ? selectedRows.length : undefined"
    :bulk-action-flag="props.bulkActionFlag"
    :bulk-action-buttons="props.bulkActionButtons"
    @update:page="handlePageChange"
    @update:size="handleSizeChange"
    @bulk-action="handleBulkAction"
  />
</template>

<style scoped>
  tr + tr {
    margin-top: 8px;
  }
</style>
