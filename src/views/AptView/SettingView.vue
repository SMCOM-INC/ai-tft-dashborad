<script setup>
  import IconAlertCircleGray from '@assets/icons/icon-alert-circle-gray.svg';
  import IconError from '@assets/icons/icon-errorInfo-red.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipInput from '@components/common/ChipInput.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TableView from '@components/common/TableView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import AddHouseModal from '@views/AptView/AddHouseModal.vue';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';


  import useGetAptDongLineHoList from '@/lib/queries/apt/useGetAptDongLineHoList.js';
  import useGetAptDongLineList from '@/lib/queries/apt/useGetAptDongLineList.js';
  import useGetAptDongList from '@/lib/queries/apt/useGetAptDongList.js';
  import usePostAptDongBundle from '@/lib/queries/apt/usePostAptDongBundle.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import { createHouseholdBatchDongValidationSchema } from '@/schemas/apt.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';


  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const selectedDongRef = ref('');
  const selectedLineRef = ref('');
  const selectedHoRef = ref('');

  const {
    createBatchDongMutation,
    isCreateBatchDongPending,
    isCreateBatchDongSuccess,
    resetCreateBatchDong,
  } = usePostAptDongBundle();

  const createBatchDongModalRef = ref(false);
  const addHouseModalRef = ref(null);
  const excludedHos = ref([]);

  const {
    householdDongList,
    isHouseholdDongListLoading,
    isHouseholdDongListError,
    householdDongListError,
  } = useGetAptDongList(userInfo.aptUuid);

  const {
    householdLineList,
    isHouseholdLineListLoading,
    isHouseholdLineListError,
    householdLineListError,
  } = useGetAptDongLineList(
    computed(() => ({
      aptUuid: userInfo.aptUuid,
      dongUuid: selectedDongRef.value,
    })),
    {
      enabled: computed(() => !!selectedDongRef.value),
    },
  );

  const {
    householdHoList,
    isHouseholdHoListLoading,
    isHouseholdHoListError,
    householdHoListError,
  } = useGetAptDongLineHoList(
    computed(() => ({
      aptUuid: userInfo.aptUuid,
      dongUuid: selectedDongRef.value,
      lineUuid: selectedLineRef.value,
    })),
    {
      enabled: computed(
        () => !!selectedDongRef.value && !!selectedLineRef.value,
      ),
    },
  );

  const isHouseholdDongListHasData = computed(
    () => householdDongList.value?.length > 0 ?? false,
  );

  const isHouseholdLineListHasData = computed(
    () =>
      (householdLineList.value && householdLineList.value.length > 0) ||
      (householdDongList.value && householdDongList.value.length > 0),
  );

  const selectedDongName = computed(() => {
    if (selectedDongRef.value !== '') {
      const selectedDong = householdDongList.value?.find(
        (dong) => dong.uuid === selectedDongRef.value,
      );
      return selectedDong?.dongName || '';
    }
    return '';
  });

  const selectedLineName = computed(() => {
    if (selectedLineRef.value !== '') {
      const selectedLine = householdLineList.value?.find(
        (line) => line.uuid === selectedLineRef.value,
      );
      return selectedLine?.lineName || '';
    }
    return '';
  });

  // 동·호수 일괄 등록 폼
  const batchDongSchema = computed(() =>
    toTypedSchema(
      createHouseholdBatchDongValidationSchema(
        householdDongList.value
          ? householdDongList.value.map((dong) => dong.dongName)
          : [],
      ),
    ),
  );

  const {
    errors: batchDongErrors,
    setFieldValue: setBatchDongFieldValue,
    handleSubmit: handleBatchDongSubmit,
    resetForm: resetBatchDongForm,
    defineField: defineBatchDongField,
  } = useForm({
    validationSchema: batchDongSchema,
  });

  const [dongName] = defineBatchDongField('dongName');
  const [maxFloor] = defineBatchDongField('maxFloor');
  const [maxLine] = defineBatchDongField('maxLine');

  const handleDongRowClick = (row) => {
    selectedDongRef.value = row.uuid;
    selectedLineRef.value = '';
  };

  const handleLineRowClick = (row) => {
    selectedLineRef.value = row.uuid;
  };

  const handleHoRowClick = (row) => {
    selectedHoRef.value = row.uuid;
  };

  const handleCreateBatchDongModalOpen = () => {
    if (createBatchDongModalRef.value) {
      createBatchDongModalRef.value.openModal();
    }
  };

  const handleAddHouseModalOpen = () => {
    if (
      selectedDongRef.value === '' ||
      selectedDongRef.value === null ||
      selectedLineRef.value === '' ||
      selectedLineRef.value === null
    ) {
      swalWarningModal({
        title: '동과 라인을 선택해주세요.',
        text: '추가할 세대의 동과 라인을 선택해주세요.',
      });
      return;
    }

    if (addHouseModalRef.value) {
      addHouseModalRef.value.openModal();
    }
  };

  const closeBatchDongModal = () => {
    resetBatchDongForm();
    excludedHos.value = [];
    selectedDongRef.value = '';
    selectedLineRef.value = '';
    selectedHoRef.value = '';
    createBatchDongModalRef.value?.closeModal();
  };

  const onBatchDongSubmit = handleBatchDongSubmit((values) => {
    swalConfirmModal({
      text: '세대를 추가하시겠습니까?',
      callback: () => {
        createBatchDongMutation({
          aptUuid: userInfo.aptUuid,
          payload: {
            ...values,
            removeHo: excludedHos.value,
          },
        });
      },
    });
  });

  const handleCloseModal = () => {
    excludedHos.value = [];
  };

  // mutation 성공 시 모달 닫기
  watch(isCreateBatchDongSuccess, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      closeBatchDongModal();
      resetCreateBatchDong();
    }
  });
</script>

<template>
  <PageTitleBase
    title="단지 관리 설정"
    :paragraph="`${token.userRole === 'master' || token.userRole === 'middle_admin' ? '단지 동·호수를 설정해주세요.' : '단지 동·호수를 조회할 수 있습니다.'}`"
  />
  <div class="-mt-4 mb-6 flex justify-between">
    <div class="flex items-center gap-4">
      <h3 class="pretendard-large">세대 동·호수</h3>
      <div
        v-if="!householdDongList?.length"
        class="flex select-none items-center gap-2"
      >
        <span class="text-destructive-100">미완료</span>
        <IconError class="h-4 w-4" />
      </div>
    </div>
    <ModalBase
      v-if="token.userRole === 'master' || token.userRole === 'middle_admin'"
      ref="createBatchDongModalRef"
      title="동·호수 등록하기"
      :has-form="true"
      form-id="createBatchDongForm"
      :is-loading="isCreateBatchDongPending"
      @form-submit="onBatchDongSubmit"
      @close-modal="handleCloseModal"
    >
      <template #button>
        <ButtonBase
          type="button"
          color="primary"
          @click="handleCreateBatchDongModalOpen"
        >
          동·호수 등록하기
        </ButtonBase>
      </template>
      <template #modalBody>
        <ul class="flex flex-col gap-4">
          <li>
            <LabelBase label-for="dongName" label-text="생성 동" asterisk>
              <input
                id="dongName"
                v-model="dongName"
                type="text"
                placeholder="등록할 동을 입력해주세요."
                class="w-full rounded-md border px-3 py-2"
              />
            </LabelBase>
            <TextError v-if="batchDongErrors.dongName">
              {{ batchDongErrors.dongName }}
            </TextError>
          </li>
          <li>
            <LabelBase label-for="maxFloor" label-text="최대 층 수" asterisk>
              <input
                id="maxFloor"
                v-model="maxFloor"
                type="text"
                inputmode="numeric"
                placeholder="해당 동에서 가장 높은 층 수를 입력해주세요."
                class="w-full rounded-md border px-3 py-2"
              />
            </LabelBase>
            <TextError v-if="batchDongErrors.maxFloor">
              {{ batchDongErrors.maxFloor }}
            </TextError>
          </li>
          <li>
            <LabelBase label-for="maxLine" label-text="최대 라인 수" asterisk>
              <input
                id="maxLine"
                v-model="maxLine"
                type="text"
                inputmode="numeric"
                placeholder="해당 동의 최대 라인 수를 입력해주세요."
                class="w-full rounded-md border px-3 py-2"
              />
            </LabelBase>
            <TextError v-if="batchDongErrors.maxLine">
              {{ batchDongErrors.maxLine }}
            </TextError>
          </li>
          <li>
            <LabelBase label-for="removeHo" label-text="제외할 호수">
              <ChipInput
                :model-value="excludedHos"
                placeholder="제외할 호수를 쉼표로 구분하여 입력해주세요."
                @update:model-value="setBatchDongFieldValue('removeHo', $event)"
              />
            </LabelBase>
          </li>
        </ul>
      </template>
      <template #submitButton>
        <ButtonBase
          form="createBatchDongForm"
          type="submit"
          color="primary"
          size="md"
          :disabled="isCreateBatchDongPending"
          class="flex w-full justify-center"
        >
          <SpinnerCircle v-if="isCreateBatchDongPending" />
          <template v-else>등록하기</template>
        </ButtonBase>
      </template>
    </ModalBase>
  </div>
  <div
    v-if="!householdDongList?.length"
    class="flex h-52 flex-col items-center justify-center gap-2 rounded-md border border-dark-100"
  >
    <IconAlertCircleGray class="h-6 w-6 text-muted-foreground-100" />
    <p class="font-medium text-muted-foreground-100">
      동·호수 데이터가 존재하지 않습니다.
    </p>
  </div>
  <div v-else>
    <div class="flex w-[750px] gap-3">
      <TableView
        key="dongTable"
        :fixed-height="true"
        :column-data="[{ name: '동', key: 'dongName' }]"
        :page-data="{ content: householdDongList }"
        :row-function="handleDongRowClick"
        :pageable="false"
        :is-single-select="true"
        :has-child="true"
        :skeleton-lines="2"
        :is-loading="isHouseholdDongListLoading"
        :is-error="isHouseholdDongListError"
        :error="householdDongListError"
      />
      <TableView
        key="lineTable"
        :fixed-height="true"
        :column-data="[{ name: '라인', key: 'lineName' }]"
        :page-data="{ content: householdLineList }"
        :row-function="handleLineRowClick"
        :pageable="false"
        :is-single-select="true"
        :has-child="true"
        :empty-placeholder-text="
          isHouseholdDongListHasData
            ? '동을 선택해주세요'
            : '데이터가 존재하지 않습니다'
        "
        :skeleton-lines="2"
        :is-loading="isHouseholdLineListLoading"
        :is-error="isHouseholdLineListError"
        :error="householdLineListError"
      />
      <TableView
        key="hoTable"
        :fixed-height="true"
        :column-data="[
          { name: '층', key: 'floorName' },
          { name: '호', key: 'hoName' },
        ]"
        :page-data="{ content: householdHoList }"
        :row-function="handleHoRowClick"
        :pageable="false"
        :is-single-select="true"
        :empty-placeholder-text="
          isHouseholdLineListHasData
            ? '라인을 선택해주세요'
            : '데이터가 존재하지 않습니다'
        "
        :skeleton-lines="2"
        :is-loading="isHouseholdHoListLoading"
        :is-error="isHouseholdHoListError"
        :error="householdHoListError"
      />
    </div>
    <AddHouseModal
      v-if="token.userRole === 'master' || token.userRole === 'middle_admin'"
      ref="addHouseModalRef"
      :dong-name="selectedDongName"
      :line-name="selectedLineName"
      @before-open="handleAddHouseModalOpen"
    />
  </div>
</template>
