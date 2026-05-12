<script setup>
  import IconEditLineBlack from '@assets/icons/icon-edit-line-black.svg';
  import EyeOffIcon from '@assets/icons/icon-eyeOff-line-black.svg';
  import EyeOnIcon from '@assets/icons/icon-eyeOpen-line-black.svg';
  import FileUploadIcon from '@assets/icons/icon-upload-line-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import ModalFieldService from '@components/common/ModalFieldService.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Field, useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';


  import { APT_PORT_CONFIG_FOR_CONTENT_LIST } from '@/constants/apt.js';
  import usePostMasterApt from '@/lib/queries/apt/usePostMasterApt.js';
  import usePutMasterAptDetail from '@/lib/queries/apt/usePutMasterAptDetail.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import formatFileSize from '@/lib/utils/formatFileSize.js';
  import {
    masterAptFormCreationSchema,
    masterAptFormUpdateSchema,
  } from '@/schemas/apt.js';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['edit', 'create'].includes(value),
    },
    aptDetail: {
      type: Object,
      required: false,
      default: null,
    },
  });

  const {
    createAptMutation,
    isCreateAptPending,
    isCreateAptSuccess,
    resetCreateApt,
  } = usePostMasterApt();

  const {
    updateAptDetailMutation,
    isUpdateAptDetailPending,
    isUpdateAptDetailSuccess,
    resetUpdateAptDetail,
  } = usePutMasterAptDetail();

  const createAptModalRef = ref(null);
  const selectedFileNameRef = ref('');
  const showPasswordRef = ref(false);
  const selectedServicesRef = ref([]);
  const isSubmittedRef = ref(false);

  const isCreatedMode = computed(() => {
    return props.mode === 'create' ? '등록' : '수정';
  });

  const isMutationPending = computed(() =>
    props.mode === 'create'
      ? isCreateAptPending.value
      : isUpdateAptDetailPending.value,
  );

  const { errors, resetForm, setFieldValue, handleSubmit } = useForm({
    validationSchema: toTypedSchema(
      props.mode === 'create'
        ? masterAptFormCreationSchema
        : masterAptFormUpdateSchema,
    ),
  });

  const togglePasswordVisibility = () => {
    showPasswordRef.value = !showPasswordRef.value;
  };

  const cleanPhoneNumber = (event) => {
    const cleanedValue = event.target.value.replace(/\D/g, '');
    setFieldValue('representativePhone', cleanedValue);
  };

  const populateFormFields = () => {
    if (props.mode === 'edit' && props.aptDetail) {
      Object.entries(props.aptDetail).forEach(([key, value]) => {
        if (key === 'aptName') {
          setFieldValue('name', value);
        } else if (key === 'aptTel') {
          setFieldValue('representativePhone', value);
        } else {
          setFieldValue(key, value);
        }
      });

      const uuids =
        props.aptDetail?.contentList?.map((content) => content.uuid) || [];

      selectedServicesRef.value = uuids;

      setFieldValue('contentUuidList', uuids);
    }
  };

  const handleOpenModal = () => {
    if (createAptModalRef.value) {
      createAptModalRef.value.openModal();
      populateFormFields();
    }
  };

  const handleModalClose = () => {
    resetForm();
    selectedFileNameRef.value = '';
    selectedServicesRef.value = [];
    showPasswordRef.value = false;
    isSubmittedRef.value = false;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formattedSize = formatFileSize(file.size);
      selectedFileNameRef.value = `${file.name} (${formattedSize})`;
    } else {
      selectedFileNameRef.value = '';
    }
  };

  const handleServiceChange = (newServices) => {
    selectedServicesRef.value = newServices;
    setFieldValue('contentUuidList', newServices);
  };

  const closeModal = () => {
    handleModalClose();
    createAptModalRef.value?.closeModal();
  };

  const onSubmit = handleSubmit((submitValues) => {
    swalConfirmModal({
      text: `단지를 ${isCreatedMode.value}하시겠습니까?`,
      callback: () => {
        const processedData = {
          ...submitValues,
          contentUuidList: Array.from(selectedServicesRef.value),
        };

        // undefined, null, 빈 문자열 값 제거
        Object.keys(processedData).forEach((key) => {
          if (
            processedData[key] === undefined ||
            processedData[key] === null ||
            processedData[key] === ''
          ) {
            delete processedData[key];
          }
        });

        // content[ 로 시작하는 키 제거
        Object.keys(processedData)
          .filter((key) => key.startsWith('content['))
          .forEach((key) => delete processedData[key]);

        if (props.mode === 'edit') {
          updateAptDetailMutation({
            aptUuid: props.aptDetail.aptUuid,
            data: processedData,
          });
        } else {
          createAptMutation(processedData);
        }
      },
    });
  });

  // mutation 성공 시 모달 닫기
  watch(
    [isCreateAptSuccess, isUpdateAptDetailSuccess],
    (
      [createSuccess, updateSuccess],
      [prevCreateSuccess, prevUpdateSuccess],
    ) => {
      if (
        (createSuccess && !prevCreateSuccess) ||
        (updateSuccess && !prevUpdateSuccess)
      ) {
        closeModal();
        if (createSuccess) resetCreateApt();
        if (updateSuccess) resetUpdateAptDetail();
      }
    },
  );

  const isParkingPortRequired = computed(() => {
    return selectedServicesRef.value.some((service) =>
      APT_PORT_CONFIG_FOR_CONTENT_LIST.requireParkingPortsContents.includes(
        service,
      ),
    );
  });

  const isElevatorPortRequired = computed(() => {
    return selectedServicesRef.value.some((service) =>
      APT_PORT_CONFIG_FOR_CONTENT_LIST.requireElevatorPortsContents.includes(
        service,
      ),
    );
  });
</script>

<template>
  <ModalBase
    ref="createAptModalRef"
    :title="`단지 ${isCreatedMode}하기`"
    :has-form="true"
    form-id="createAptForm"
    @form-submit="onSubmit"
  >
    <template #button>
      <ButtonBase
        v-if="props.mode === 'create'"
        type="button"
        color="primary"
        size="md"
        custom-class="mb-8"
        @click="handleOpenModal"
      >
        단지 등록하기
      </ButtonBase>
      <button
        v-else
        type="button"
        class="flex select-none items-center gap-2 px-4 py-2"
        @click="handleOpenModal"
      >
        <IconEditLineBlack class="h-5 w-5" aria-hidden="true" />
        <span>수정</span>
      </button>
    </template>
    <template #modalBody>
      <ul class="flex flex-col gap-4">
        <li>
          <LabelBase label-for="name" label-text="단지명" asterisk>
            <Field
              id="name"
              type="text"
              name="name"
              placeholder="단지명을 입력해주세요."
              autocomplete="off"
              class="w-full rounded-md border px-3 py-2"
              :value="props.mode === 'edit' ? aptDetail.name : ''"
              :class="errors.name ? 'border-red-500' : ''"
            />
          </LabelBase>
          <TextError v-if="errors.name">{{ errors.name }}</TextError>
        </li>
        <li class="flex flex-col">
          <LabelBase label-for="logoFile" label-text="로고">
            <Field
              id="logoFile"
              type="file"
              name="logoFile"
              class="hidden"
              accept="image/*"
              @change="handleFileChange"
            />
            <label
              for="logoFile"
              class="flex cursor-pointer gap-1 rounded-md border px-3 py-2 text-muted-foreground-100"
            >
              <FileUploadIcon class="h-5 w-5" />
              {{ selectedFileNameRef || '파일을 선택해주세요.' }}
            </label>
          </LabelBase>
          <TextError v-if="errors.logoFile">{{ errors.logoFile }}</TextError>
          <p class="pt-2 text-xs leading-5 text-muted-foreground-100">
            권장 크기 : 750 X 750 px, 최소 300 X 300 px 이상<br />
            최대 20MB의 *.jpg, *.jpeg, *.png, *.gif 형식의 이미지만 등록
            가능합니다.
          </p>
        </li>
        <li>
          <LabelBase label-for="address" label-text="주소" asterisk>
            <Field
              id="address"
              type="text"
              name="address"
              placeholder="주소를 입력해주세요."
              autocomplete="address"
              class="w-full rounded-l-md border px-3 py-2"
              :value="props.mode === 'edit' ? aptDetail.address : ''"
              :class="errors.address ? 'border-red-500' : ''"
            />
          </LabelBase>
          <TextError v-if="errors.address">{{ errors.address }}</TextError>
        </li>
        <li>
          <LabelBase
            label-for="representativePhone"
            label-text="대표 연락처"
            asterisk
          >
            <Field
              id="representativePhone"
              type="tel"
              pattern="[0-9]*"
              name="representativePhone"
              placeholder="숫자만 입력해주세요."
              autocomplete="tel-national"
              class="w-full rounded-md border px-3 py-2"
              :value="
                props.mode === 'edit' ? aptDetail.representativePhone : ''
              "
              :class="errors.representativePhone ? 'border-red-500' : ''"
              @input="cleanPhoneNumber"
              @blur="cleanPhoneNumber"
            />
          </LabelBase>
          <TextError v-if="errors.representativePhone">{{
            errors.representativePhone
          }}</TextError>
        </li>
        <div class="flex w-full gap-4">
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="householdCount"
              label-text="세대 수"
              asterisk
              class="w-full"
            >
              <Field
                id="householdCount"
                type="number"
                name="householdCount"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :value="props.mode === 'edit' ? aptDetail.householdCount : ''"
                :class="errors.householdCount ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.householdCount">{{
              errors.householdCount
            }}</TextError>
          </li>
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="parkingSpaceCount"
              label-text="주차 면 수"
              asterisk
              class="w-full"
            >
              <Field
                id="parkingSpaceCount"
                type="number"
                name="parkingSpaceCount"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :value="
                  props.mode === 'edit' ? aptDetail.parkingSpaceCount : ''
                "
                :class="errors.parkingSpaceCount ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.parkingSpaceCount">{{
              errors.parkingSpaceCount
            }}</TextError>
          </li>
        </div>
        <div v-if="props.mode === 'create'" class="flex w-full gap-4">
          <li class="flex w-1/2 flex-col">
            <LabelBase
              label-for="aptAdminId"
              label-text="단지관리자 ID"
              autocomplete="username"
              asterisk
              class="w-full"
            >
              <Field
                id="aptAdminId"
                type="text"
                name="aptAdminId"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.aptAdminId ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.aptAdminId" class="mt-1">{{
              errors.aptAdminId
            }}</TextError>
          </li>
          <div class="flex w-1/2 flex-col">
            <li class="flex flex-wrap">
              <LabelBase
                label-for="initPassword"
                label-text="초기 비밀번호"
                asterisk
                class="w-full"
              >
                <div class="relative w-full">
                  <Field
                    id="initPassword"
                    name="initPassword"
                    :type="showPasswordRef ? 'text' : 'password'"
                    class="w-full rounded-md border px-3 py-2"
                    :class="errors.initPassword ? 'border-red-500' : ''"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-2"
                    @click="togglePasswordVisibility"
                  >
                    <component
                      :is="showPasswordRef ? EyeOffIcon : EyeOnIcon"
                      :aria-label="
                        showPasswordRef ? '숨김 아이콘' : '보기 아이콘'
                      "
                      class="h-5 w-5"
                    />
                  </button>
                </div>
              </LabelBase>
              <TextError v-if="errors.initPassword" class="mt-1">{{
                errors.initPassword
              }}</TextError>
            </li>
          </div>
        </div>
        <div class="flex flex-col">
          <ModalFieldService
            v-model="selectedServicesRef"
            :apt-services="props.mode === 'edit' ? aptDetail?.contentList : []"
            :is-edit-mode="props.mode === 'edit'"
            @update:model-value="handleServiceChange"
          />
          <TextError v-if="isSubmittedRef && errors.contentUuidList"
            >{{ errors.contentUuidList }}
          </TextError>
        </div>
        <div
          v-if="isParkingPortRequired || isElevatorPortRequired"
          class="flex w-full pt-2"
        >
          <h3 class="select-none text-sm font-medium leading-none">
            포트 정보
          </h3>
        </div>
        <div v-if="isParkingPortRequired" class="flex w-full gap-4">
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="guardApiPort"
              label-text="경비원 API 포트"
              asterisk
              class="w-full"
            >
              <Field
                id="guardApiPort"
                type="number"
                name="guardApiPort"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.guardApiPort ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.guardApiPort">
              {{ errors.guardApiPort }}
            </TextError>
          </li>
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="guardWebPort"
              label-text="경비원 웹 포트"
              asterisk
              class="w-full"
            >
              <Field
                id="guardWebPort"
                type="number"
                name="guardWebPort"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.guardWebPort ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.guardWebPort">
              {{ errors.guardWebPort }}
            </TextError>
          </li>
        </div>
        <div v-if="isParkingPortRequired" class="flex w-full gap-4">
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="guardSshPort"
              label-text="경비원 SSH 포트"
              class="w-full"
              asterisk
            >
              <Field
                id="guardSshPort"
                type="number"
                name="guardSshPort"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.guardSshPort ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.guardSshPort">
              {{ errors.guardSshPort }}
            </TextError>
          </li>
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="guardDbPort"
              label-text="경비원 DB 포트"
              class="w-full"
              asterisk
            >
              <Field
                id="guardDbPort"
                type="number"
                name="guardDbPort"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.guardDbPort ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.guardDbPort">
              {{ errors.guardDbPort }}
            </TextError>
          </li>
        </div>
        <div v-if="isElevatorPortRequired" class="flex w-full gap-4">
          <li class="flex w-1/2 flex-wrap">
            <LabelBase
              label-for="elevatorApiPort"
              label-text="엘리베이터 API 포트"
              class="w-full"
            >
              <Field
                id="elevatorApiPort"
                type="number"
                name="elevatorApiPort"
                min="0"
                class="w-full rounded-md border px-3 py-2"
                :class="errors.elevatorApiPort ? 'border-red-500' : ''"
              />
            </LabelBase>
            <TextError v-if="errors.elevatorApiPort">
              {{ errors.elevatorApiPort }}
            </TextError>
          </li>
        </div>
      </ul>
    </template>
    <template #submitButton>
      <ButtonBase
        form="createAptForm"
        type="submit"
        color="primary"
        size="md"
        custom-class="w-full"
        :disabled="isMutationPending"
      >
        <div
          v-if="isMutationPending"
          class="flex items-center justify-center gap-2"
        >
          <span>{{ isCreatedMode }}중..</span>
          <SpinnerWhiteView />
        </div>
        <div v-else class="w-full">{{ isCreatedMode }}하기</div>
      </ButtonBase>
    </template>
  </ModalBase>
</template>
