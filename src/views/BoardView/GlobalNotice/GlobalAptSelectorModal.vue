<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import _ from 'lodash';
  import { computed, onMounted, ref, watch } from 'vue';

  import useGetAptContentList from '@/lib/queries/apt/useGetAptContentList.js';
  import useGetMasterAptList from '@/lib/queries/apt/useGetMasterAptList.js';

  const props = defineProps({
    selectedApartments: {
      type: Array, // 이미 선택된 아파트 목록
      default: () => [],
    },
    selectedServices: {
      type: Array, // 이미 선택된 서비스 목록 (UUID 배열)
      default: () => [],
    },
    noticeType: {
      type: String, // 공지 타입
      default: 'RESIDENT_ALL_NOTICE',
    },
  });

  const emit = defineEmits([
    'close',
    'update:selectedApartments',
    'update:selectedServices',
  ]);

  // ===== 외부 데이터 =====
  const fetchParams = computed(() => ({
    pageable: {
      page: 0,
      size: 9999,
      sort: '',
      direction: '',
    },
    searchParams: {
      keyword: '',
      contentUuidList: [], // 빈 배열로 고정
    },
  }));

  const { aptTableList, isAptListLoading: isAptNameListLoading } =
    useGetMasterAptList(fetchParams);

  const {
    contentList,
    isContentListLoading,
    isSuccess: isContentListSuccess,
    isError: isContentListError,
    error: contentListError,
  } = useGetAptContentList();

  // ===== 상태 관리 =====
  const tempSelectedServices = ref([]); // 임시 서비스 선택 상태 (UUID 배열)
  const availableApartments = ref([]); // 선택 가능한 아파트 목록 (왼쪽)
  const tempSelectedApartments = ref([]); // 임시 선택된 아파트 목록 (오른쪽)
  const leftChecked = ref([]); // 왼쪽에서 체크된 아파트들
  const rightChecked = ref([]); // 오른쪽에서 체크된 아파트들

  // ===== computed =====

  // ALL_NOTICE 타입인지 확인
  const isAllNoticeType = computed(() =>
    props.noticeType.includes('ALL_NOTICE'),
  );

  // 동적 문구들
  const modalTitle = computed(() =>
    isAllNoticeType.value
      ? '아파트 단지 및 서비스 선택 (전체 공지)'
      : '아파트 단지 및 서비스 선택 (개별 공지)',
  );

  const apartmentSectionTitle = computed(() =>
    isAllNoticeType.value ? '제외할 아파트 선택' : '공지할 아파트 선택',
  );

  const selectedPanelTitle = computed(() =>
    isAllNoticeType.value ? '제외될 아파트' : '공지될 아파트',
  );

  const emptyStateMessage = computed(() =>
    isAllNoticeType.value
      ? '제외할 아파트가 없습니다.'
      : '공지할 아파트가 없습니다.',
  );

  // 서비스 목록 (선택 상태 포함)
  const servicesWithCheckState = computed(() =>
    _.map(contentList.value || [], (service) => ({
      ...service,
      checked: _.includes(tempSelectedServices.value, service.uuid),
    })),
  );

  // 선택된 서비스 이름들을 가져오는 computed
  const selectedServiceNames = computed(() => {
    if (!contentList.value || _.isEmpty(tempSelectedServices.value)) return [];

    return contentList.value
      .filter((service) => _.includes(tempSelectedServices.value, service.uuid))
      .map((service) => service.name);
  });

  // 선택된 서비스를 지원하는 아파트만 필터링
  const filteredApartments = computed(() => {
    if (!aptTableList.value?.content) return [];

    // 서비스가 선택되지 않았으면 전체 아파트 반환
    if (_.isEmpty(selectedServiceNames.value)) {
      return aptTableList.value.content;
    }

    // 선택된 서비스를 모두 지원하는 아파트만 필터링 (전체/개별 공지 모두 적용)
    return aptTableList.value.content.filter((apt) => {
      const aptContentList = apt.contentList || [];
      return selectedServiceNames.value.every((serviceName) =>
        aptContentList.includes(serviceName),
      );
    });
  });

  const aptNameList = computed(() => {
    return filteredApartments.value.map((item) => ({
      aptUuid: item.uuid,
      aptName: item.name,
      address: item.address || '',
    }));
  });

  const isAllLeftChecked = computed(
    () =>
      !_.isEmpty(availableApartments.value) &&
      _.size(leftChecked.value) === _.size(availableApartments.value),
  );

  const isAllRightChecked = computed(
    () =>
      !_.isEmpty(tempSelectedApartments.value) &&
      _.size(rightChecked.value) === _.size(tempSelectedApartments.value),
  );

  const canMoveToSelected = computed(() => !_.isEmpty(leftChecked.value));
  const canMoveToAvailable = computed(() => !_.isEmpty(rightChecked.value));

  // ===== 서비스(Contents) 관련 로직 =====
  const toggleService = (uuid) => {
    tempSelectedServices.value = _.includes(tempSelectedServices.value, uuid)
      ? _.without(tempSelectedServices.value, uuid)
      : [...tempSelectedServices.value, uuid];

    // 서비스 변경 시 선택된 아파트 초기화
    tempSelectedApartments.value = [];
    leftChecked.value = [];
    rightChecked.value = [];
  };

  // ===== 아파트 관련 로직 =====
  const initializeApartmentData = () => {
    // 이미 선택된 아파트 제외하고 선택 가능한 목록 생성
    availableApartments.value = _.filter(
      aptNameList.value,
      (apt) =>
        !_.includes(
          _.map(tempSelectedApartments.value, 'aptUuid'),
          apt.aptUuid,
        ),
    );

    // 체크박스 상태 초기화
    leftChecked.value = [];
    rightChecked.value = [];
  };

  const toggleAllSelection = (isLeft = true) => {
    const targetList = isLeft
      ? availableApartments.value
      : tempSelectedApartments.value;
    const checkedRef = isLeft ? leftChecked : rightChecked;
    const isAllChecked = isLeft
      ? isAllLeftChecked.value
      : isAllRightChecked.value;

    checkedRef.value = isAllChecked ? [] : [...targetList];
  };

  const moveApartments = (toSelected = true) => {
    const checkedItems = toSelected ? leftChecked.value : rightChecked.value;

    if (_.isEmpty(checkedItems)) return;

    if (toSelected) {
      // 왼쪽 → 오른쪽 이동
      tempSelectedApartments.value.push(...checkedItems);
      availableApartments.value = _.differenceBy(
        availableApartments.value,
        checkedItems,
        'aptUuid',
      );
      leftChecked.value = [];
    } else {
      // 오른쪽 → 왼쪽 이동
      availableApartments.value.push(...checkedItems);
      tempSelectedApartments.value = _.differenceBy(
        tempSelectedApartments.value,
        checkedItems,
        'aptUuid',
      );
      rightChecked.value = [];
    }
  };

  // ===== 이벤트 핸들러 =====
  // 공지 타입에 따른 저장 가능 조건
  const canSave = computed(() => {
    const hasSelectedApartments = !_.isEmpty(tempSelectedApartments.value);
    const hasSelectedServices = !_.isEmpty(tempSelectedServices.value);

    // 전체 공지: 서비스 필수, 개별 공지: 아파트 필수
    return isAllNoticeType.value ? hasSelectedServices : hasSelectedApartments;
  });

  const handleClose = () => emit('close');

  const handleSave = () => {
    // 선택된 아파트 저장
    emit(
      'update:selectedApartments',
      _.cloneDeep(tempSelectedApartments.value),
    );

    // 선택된 서비스 저장
    emit('update:selectedServices', _.clone(tempSelectedServices.value));

    handleClose();
  };

  // ===== 초기화 =====
  const initializeModal = () => {
    // 서비스 선택 상태를 props에서 복사
    tempSelectedServices.value = _.clone(props.selectedServices);
    // 선택된 아파트들을 임시 목록에 복사
    tempSelectedApartments.value = _.cloneDeep(props.selectedApartments);

    // 아파트 데이터 초기화
    initializeApartmentData();
  };

  // ===== Watch 및 생명주기 =====

  // 필터링된 아파트 목록이 변경되면 '선택 가능한 아파트' 목록 업데이트
  watch(aptNameList, () => {
    if (!_.isEmpty(aptNameList.value)) {
      // 이미 선택된 아파트 제외하고 선택 가능한 목록만 업데이트
      availableApartments.value = _.filter(
        aptNameList.value,
        (apt) =>
          !_.includes(
            _.map(tempSelectedApartments.value, 'aptUuid'),
            apt.aptUuid,
          ),
      );

      // 체크박스 상태 초기화
      leftChecked.value = [];
      rightChecked.value = [];
    }
  });

  onMounted(() => {
    initializeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="w-[900px] max-w-[95vw] rounded-lg bg-white">
      <!-- 모달 헤더 -->
      <div class="flex items-center justify-between border-b p-6">
        <h2 class="text-lg font-semibold">{{ modalTitle }}</h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="handleClose"
        >
          ✕
        </button>
      </div>

      <!-- 모달 본문 -->
      <div class="flex flex-col space-y-6 p-6">
        <!-- 서비스 선택 영역 -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-medium">사용 서비스</h3>
            <!-- 전체 공지일 때만 필수 표시 -->
            <span
              v-if="props.noticeType.includes('ALL_NOTICE')"
              class="text-red-500"
              >*</span
            >
            <span v-else class="text-sm text-gray-500">(선택사항)</span>
          </div>

          <!-- 서비스 목록 -->
          <div v-if="isContentListSuccess" class="flex flex-wrap gap-2">
            <LabelBase
              v-for="service in servicesWithCheckState"
              :key="service.uuid"
              :label-for="`service-${service.uuid}`"
              :label-text="service.name"
              :class="`cursor-pointer break-keep rounded-md border px-3 py-2 text-sm transition-colors ${
                service.checked
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`"
              @click="toggleService(service.uuid)"
            />
          </div>

          <!-- 서비스 로딩 상태 -->
          <div
            v-else-if="isContentListLoading"
            class="flex h-16 items-center justify-center text-gray-500"
          >
            서비스 리스트를 불러오는 중입니다...
          </div>

          <!-- 서비스 로드 에러 -->
          <div
            v-else-if="isContentListError"
            class="flex h-16 items-center justify-center text-red-500"
          >
            서비스 리스트를 불러오는 중 오류가 발생했습니다:
            {{ contentListError }}
          </div>
        </div>

        <!-- 구분선 -->
        <hr class="border-gray-200" />

        <!-- 아파트 선택 영역 -->
        <div class="space-y-4">
          <h3 class="text-base font-medium">{{ apartmentSectionTitle }}</h3>

          <div class="flex h-96 gap-6 overflow-hidden">
            <!-- 왼쪽 패널: 선택 가능한 아파트 목록 -->
            <div class="flex flex-1 flex-col rounded-lg border">
              <div class="flex items-center justify-between border-b p-4">
                <h4 class="text-sm font-medium">
                  전체 아파트 ({{ _.size(availableApartments) }}개)
                </h4>
                <label class="flex items-center gap-2 text-sm">
                  <input
                    :checked="isAllLeftChecked"
                    type="checkbox"
                    @change="toggleAllSelection(true)"
                  />
                  <span>전체 선택</span>
                </label>
              </div>

              <div class="flex-1 overflow-y-auto p-2">
                <!-- 로딩 상태 -->
                <div v-if="isAptNameListLoading" class="space-y-2">
                  <SkeletonBar v-for="i in 5" :key="i" />
                </div>
                <!-- 아파트 목록 -->
                <div v-else class="space-y-1">
                  <label
                    v-for="apartment in availableApartments"
                    :key="apartment.aptUuid"
                    class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50"
                  >
                    <input
                      v-model="leftChecked"
                      :value="apartment"
                      type="checkbox"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm font-medium">
                        {{ apartment.aptName }}
                      </div>
                      <div class="truncate text-xs text-gray-500">
                        {{ apartment.address }}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 중앙 패널: 이동 버튼들 -->
            <div class="flex flex-col justify-center gap-2">
              <ButtonBase
                type="button"
                variant="outline"
                size="sm"
                color="primary"
                :disabled="!canMoveToSelected"
                @click="moveApartments(true)"
              >
                →
              </ButtonBase>
              <ButtonBase
                type="button"
                variant="outline"
                size="sm"
                color="primary"
                :disabled="!canMoveToAvailable"
                @click="moveApartments(false)"
              >
                ←
              </ButtonBase>
            </div>

            <!-- 오른쪽 패널: 선택된 아파트 목록 -->
            <div class="flex flex-1 flex-col rounded-lg border">
              <div class="flex items-center justify-between border-b p-4">
                <h4 class="text-sm font-medium">
                  {{ selectedPanelTitle }} ({{
                    _.size(tempSelectedApartments)
                  }}개)
                </h4>
                <label
                  v-if="!_.isEmpty(tempSelectedApartments)"
                  class="flex items-center gap-2 text-sm"
                >
                  <input
                    :checked="isAllRightChecked"
                    type="checkbox"
                    @change="toggleAllSelection(false)"
                  />
                  <span>전체 선택</span>
                </label>
              </div>

              <div class="flex-1 overflow-y-auto p-2">
                <!-- 빈 상태 메시지 -->
                <div
                  v-if="_.isEmpty(tempSelectedApartments)"
                  class="flex h-full items-center justify-center text-sm text-gray-500"
                >
                  {{ emptyStateMessage }}
                </div>
                <!-- 선택된 아파트 목록 -->
                <div v-else class="space-y-1">
                  <label
                    v-for="apartment in tempSelectedApartments"
                    :key="apartment.aptUuid"
                    class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50"
                  >
                    <input
                      v-model="rightChecked"
                      :value="apartment"
                      type="checkbox"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm font-medium">
                        {{ apartment.aptName }}
                      </div>
                      <div class="truncate text-xs text-gray-500">
                        {{ apartment.address }}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="flex justify-end gap-2 border-t p-6">
        <ButtonBase
          type="button"
          variant="outline"
          color="secondary"
          size="md"
          @click="handleClose"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          variant="primary"
          color="primary"
          size="md"
          :disabled="!canSave"
          @click="handleSave"
        >
          저장 ({{ _.size(tempSelectedApartments) }}개 아파트)
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
