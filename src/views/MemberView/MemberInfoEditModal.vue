<script setup>
  import IconEditLineBlack from '@assets/icons/icon-edit-line-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldIsHouseholdHead from '@components/common/ModalFieldIsHouseholdHead.vue';
  import ModalFieldName from '@components/common/ModalFieldName.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import usePatchResidentDetail from '@/lib/queries/member/usePatchResidentDetail.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { residentInfoFormSchema } from '@/schemas/member.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
    },
    residentDetail: {
      type: Object,
      required: false,
      default: null,
    },
  });

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const createMemberFormRef = ref(null);

  const {
    patchResidentDetailMutation,
    isPatchResidentDetailPending,
    isPatchResidentDetailSuccess,
    resetPatchResidentDetail,
  } = usePatchResidentDetail(aptUuid);

  const { errors, handleSubmit, setFieldValue, defineField, resetForm } =
    useForm({
      validationSchema: toTypedSchema(residentInfoFormSchema),
      initialValues: {
        name: '',
        dong: '',
        ho: '',
        householdHeadFlag: false,
        testFlag: false,
      },
    });

  const [testFlag] = defineField('testFlag');

  const actionText = computed(() =>
    props.mode === 'create' ? '등록' : '수정',
  );

  const populateFormFields = () => {
    if (props.mode === 'edit' && props.residentDetail) {
      const {
        name,
        dong,
        ho,
        phone,
        residentType,
        testFlag: testFlagValue,
      } = props.residentDetail;

      setFieldValue('name', name || '');
      setFieldValue('dong', dong || '');
      setFieldValue('ho', ho || '');
      setFieldValue('phone', phone || '');
      setFieldValue('testFlag', testFlagValue || false);
      setFieldValue(
        'householdHeadFlag',
        residentType === 'HEAD' ? 'householdHead' : 'householdMember',
      );
    }
  };

  const handleOpenModal = () => {
    if (createMemberFormRef.value) {
      createMemberFormRef.value.openModal();
      populateFormFields();
    }
  };

  const closeModal = () => {
    createMemberFormRef.value?.closeModal();
    resetForm();
  };

  const onSubmit = handleSubmit((submitValues) => {
    swalConfirmModal({
      text: `회원 정보를 ${actionText.value}하시겠습니까?`,
      callback: () => {
        patchResidentDetailMutation({
          residentUuid: props.residentDetail?.uuid,
          residentDetail: submitValues,
        });
      },
    });
  });

  // mutation 성공 시 모달 닫기
  watch(isPatchResidentDetailSuccess, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      closeModal();
      resetPatchResidentDetail();
    }
  });
</script>

<template>
  <ModalBase
    ref="createMemberFormRef"
    :has-form="true"
    form-id="createMemberForm"
    :title="`세대 회원 ${actionText}하기`"
    @form-submit="onSubmit"
  >
    <template #button>
      <ButtonBase
        v-if="props.mode === 'create'"
        type="button"
        color="primary"
        custom-class="w-full"
        @click="handleOpenModal"
      >
        {{ `세대 회원 ${actionText}하기` }}
      </ButtonBase>
      <button
        v-else
        type="button"
        class="flex items-center gap-2 px-4 py-2"
        @click="handleOpenModal"
      >
        <IconEditLineBlack class="h-5 w-5" />
        <span>수정</span>
      </button>
    </template>
    <template #modalBody>
      <ul class="flex flex-col gap-4">
        <ModalFieldDongHo id="dongHo" :errors="errors" />
        <ModalFieldName id="name" :errors="errors" />
        <ModalFieldPhone
          id="phone"
          :errors="errors"
          label-text="연락처"
          :disabled="props.mode === 'edit'"
        />
        <ModalFieldIsHouseholdHead :errors="errors" />
        <!--  A-PASS 필드 추가-->
        <li v-if="props.mode !== 'create'" class="flex flex-col gap-2">
          <LabelBase
            label-for="testFlag"
            label-text="관리자 계정 여부"
            asterisk
          />
          <div>
            <ul class="flex w-full gap-2">
              <li
                class="flex w-full cursor-pointer gap-2 rounded-md border p-3"
              >
                <LabelBase
                  label-for="testFlag-yes"
                  label-text=""
                  class="flex w-full cursor-pointer gap-2"
                >
                  <div class="flex w-full items-center gap-2">
                    <input
                      id="testFlag-yes"
                      v-model="testFlag"
                      type="radio"
                      name="testFlag"
                      :value="true"
                    />
                    <span>예</span>
                  </div>
                </LabelBase>
              </li>
              <li
                class="flex w-full cursor-pointer gap-2 rounded-md border p-3"
              >
                <LabelBase
                  label-for="testFlag-no"
                  label-text=""
                  class="flex w-full cursor-pointer gap-2"
                >
                  <div class="flex w-full items-center gap-2">
                    <input
                      id="testFlag-no"
                      v-model="testFlag"
                      type="radio"
                      name="testFlag"
                      :value="false"
                    />
                    <span>아니오</span>
                  </div>
                </LabelBase>
              </li>
            </ul>
            <TextError v-if="errors.testFlag">{{ errors.testFlag }}</TextError>
          </div>
        </li>
      </ul>
    </template>
    <template #submitButton>
      <ButtonBase
        form="createMemberForm"
        type="submit"
        color="primary"
        custom-class="w-full"
      >
        <div
          v-if="isPatchResidentDetailPending"
          class="flex items-center justify-center gap-2"
        >
          <span>{{ actionText }}중..</span>
          <SpinnerWhiteView />
        </div>
        <div v-else class="w-full">{{ actionText }}하기</div>
      </ButtonBase>
    </template>
  </ModalBase>
</template>
