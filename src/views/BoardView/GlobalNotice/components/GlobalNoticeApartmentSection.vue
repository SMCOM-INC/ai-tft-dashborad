<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import GlobalAptSelectorModal from '@views/BoardView/GlobalNotice/GlobalAptSelectorModal.vue';
  import { useField } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import useGetAptContentList from '@/lib/queries/apt/useGetAptContentList.js';

  const props = defineProps({
    errors: {
      type: Object,
      default: () => ({}),
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const {
    value: selectedApartments,
    meta: apartmentsMeta,
    setValue: setSelectedApartments,
  } = useField('selectedApartments');
  // 서비스 선택 상태
  const {
    value: selectedServices,
    meta: servicesMeta,
    setValue: setSelectedServices,
  } = useField('selectedServices');
  // 공지 타입 상태
  const { value: apartmantNoticeType } = useField('apartmantNoticeType');

  const isModalOpen = ref(false);

  // 서비스 목록 가져오기
  const { contentList } = useGetAptContentList();

  // 선택된 서비스들의 이름을 가져오는 computed
  const selectedServiceNames = computed(() => {
    if (!contentList.value || !selectedServices.value?.length) return [];

    return contentList.value
      .filter((service) => selectedServices.value.includes(service.uuid))
      .map((service) => service.name);
  });

  // ALL_NOTICE 타입인지 확인
  const isAllNoticeType = computed(() =>
    apartmantNoticeType.value?.includes('ALL_NOTICE'),
  );

  // 동적 라벨 텍스트
  const apartmentLabelText = computed(() =>
    isAllNoticeType.value
      ? '제외할 대상 아파트 선택 (선택사항)'
      : '공지할 대상 아파트 선택',
  );

  // 아파트 섹션 헤더 텍스트
  const apartmentSectionTitle = computed(() =>
    isAllNoticeType.value
      ? '🚫 제외될 대상 아파트 (선택사항)'
      : ' ✅ 공지할 대상 아파트',
  );

  // 공지 타입 변경 시 선택된 데이터 초기화
  watch(apartmantNoticeType, (newValue, oldValue) => {
    // 초기 로딩이거나 값이 없으면 무시
    if (!oldValue || !newValue) return;

    // 선택된 데이터 초기화
    setSelectedApartments([]);
    setSelectedServices([]);
  });

  const openModal = () => {
    if (props.disabled) return;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const handleUpdateSelectedApartments = (newSelectedApartments) => {
    selectedApartments.value = newSelectedApartments;
  };

  // 서비스 업데이트 핸들러 - 폼 상태 업데이트
  const handleUpdateSelectedServices = (newSelectedServices) => {
    selectedServices.value = newSelectedServices;
  };
</script>

<template>
  <div>
    <LabelBase
      :label-text="apartmentLabelText"
      label-for=""
      class="gap-4"
      :asterisk="!isAllNoticeType"
    >
      <div class="space-y-3">
        <!-- 선택 버튼 -->
        <div class="flex items-center gap-4">
          <ButtonBase
            type="button"
            variant="outline"
            color="primary"
            :disabled="props.disabled"
            @click.stop="openModal"
          >
            아파트 단지 선택하기
          </ButtonBase>
          <span class="text-sm text-gray-600">
            {{ selectedApartments?.length || 0 }}개 선택됨
          </span>
        </div>
        <!-- 전체 공지일 때만 선택된 서비스 표시 -->
        <div v-if="isAllNoticeType">
          <div class="mb-3 flex items-center gap-2">
            <h4 class="text-sm font-medium text-gray-700">
              선택한 사용 서비스
            </h4>
            <span
              class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
              >필수</span
            >
          </div>
          <div class="space-y-3">
            <!-- 선택된 서비스 미리보기 -->
            <div
              v-if="selectedServiceNames?.length"
              class="mt-3 max-h-24 overflow-y-auto rounded-lg border bg-blue-50 p-4 xl:max-w-[1024px]"
            >
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="serviceName in selectedServiceNames"
                  :key="serviceName"
                  class="inline-flex items-center rounded-full bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-600"
                >
                  <svg
                    class="mr-1.5 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ serviceName }}
                </div>
              </div>
            </div>

            <!-- 선택된 서비스가 없을 때 -->
            <div
              v-else
              class="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-center xl:max-w-[1024px]"
            >
              <div class="flex flex-col items-center">
                <p class="text-sm font-medium text-blue-600">
                  사용 서비스를 선택해주세요
                </p>
                <p class="text-xs text-blue-500">
                  모달을 통해 서비스를 선택할 수 있습니다
                </p>
              </div>
            </div>
          </div>

          <TextError v-if="servicesMeta.touched && errors.selectedServices">
            {{ errors.selectedServices }}
          </TextError>
        </div>

        <!-- 아파트 섹션 헤더 -->
        <div class="mb-3 flex items-center gap-2">
          <h4 class="text-sm font-medium text-gray-700">
            {{ apartmentSectionTitle }}
          </h4>
          <span
            v-if="!isAllNoticeType"
            class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
            >필수</span
          >
        </div>

        <!-- 선택된 아파트 미리보기 -->
        <div v-if="selectedApartments?.length" class="space-y-2">
          <div
            class="max-h-32 overflow-y-auto rounded-lg border bg-gray-50 p-3 xl:max-w-[1024px]"
          >
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                v-for="apartment in selectedApartments"
                :key="apartment.uuid"
                class="flex items-center justify-between rounded bg-white px-2 py-1 text-sm"
              >
                <span class="font-medium">{{ apartment.aptName }}</span>
                <span class="text-xs text-gray-500">{{
                  apartment.address
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 선택된 아파트가 없을 때 -->
        <div
          v-else
          class="mt-3 rounded-lg border border-gray-200 bg-gray-100 p-3 text-center xl:max-w-[1024px]"
        >
          <div class="flex flex-col items-center">
            <p class="text-sm font-medium text-gray-500">
              아파트를 선택해주세요.
            </p>
            <p class="text-xs text-gray-500">
              모달을 통해 아파트를 선택할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </LabelBase>
    <TextError v-if="apartmentsMeta.touched && errors.selectedApartments">
      {{ errors.selectedApartments }}
    </TextError>

    <!-- 아파트 선택 모달 -->
    <GlobalAptSelectorModal
      v-if="isModalOpen"
      :selected-apartments="selectedApartments"
      :selected-services="selectedServices"
      :notice-type="apartmantNoticeType"
      @close="closeModal"
      @update:selected-apartments="handleUpdateSelectedApartments"
      @update:selected-services="handleUpdateSelectedServices"
    />
  </div>
</template>
