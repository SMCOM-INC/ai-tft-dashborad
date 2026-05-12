<script setup>
  import IconArrowUpRight from '@assets/icons/icon-arrow-up-right.svg';
  import IconErrorInfoRed from '@assets/icons/icon-errorInfo-red.svg';
  import EyeOffIcon from '@assets/icons/icon-eyeOff-line-black.svg';
  import EyeOnIcon from '@assets/icons/icon-eyeOpen-line-black.svg';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import EmptyView from '@components/common/EmptyView.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import ModalReconfirm from '@components/common/ModalReconfirm.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import AptModal from '@views/AptManagementView/AptModal.vue';
  import { Field, useForm } from 'vee-validate';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { APT_DETAILS_BASIC_INFO_LIST } from '@/constants/apt.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetMasterAptDetail from '@/lib/queries/apt/useGetMasterAptDetail.js';
  import usePatchMasterAptPassword from '@/lib/queries/apt/usePatchMasterAptPassword.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { masterAptPasswordFormSchema } from '@/schemas/apt.js';

  const router = useRouter();
  const { getParams, navigateTo } = useNavigate();

  const aptUuid = computed(() => {
    const params = getParams();
    return params.uuid || null;
  });

  const formatNumber = (number) => {
    return number ? number.toLocaleString('en-US') : '0';
  };

  onMounted(async () => {
    if (!aptUuid.value) {
      await swalErrorModal({
        title: '오류',
        text: '단지 정보를 찾을 수 없습니다. 단지 목록으로 이동합니다.',
      });

      router.push({ name: '단지관리' });
    }
  });

  const { aptDetail, isAptDetailLoading } = useGetMasterAptDetail(
    aptUuid.value,
  );

  const { patchAdminPasswordInit, isPasswordInitLoading, isError, error } =
    usePatchMasterAptPassword();

  const { errors } = useForm({
    validationSchema: toTypedSchema(masterAptPasswordFormSchema),
    validationMode: 'onSubmit',
  });

  const passwordResetModalRef = ref(null);
  const showPasswordRef = ref(false);
  const isFormSubmitted = ref(false);

  const handleOpenModal = () => {
    if (passwordResetModalRef.value) {
      passwordResetModalRef.value.openModal();
    }
  };

  const togglePasswordVisibility = () => {
    showPasswordRef.value = !showPasswordRef.value;
  };

  const handleHouseHouseholdNumberButton = () => {
    navigateTo(`/apt/settings?aptUuid=${aptUuid.value}`);
  };

  const handleFormSubmit = async (event) => {
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    const validatedData = masterAptPasswordFormSchema.parse(formValues);

    const result = await swalWarningModal({
      title: '비밀번호를 초기화하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (!result.isConfirmed) return;

    isFormSubmitted.value = true;

    try {
      await patchAdminPasswordInit({
        aptUuid: getParams().uuid,
        password: validatedData.initialPassword,
      });
      passwordResetModalRef.value?.closeModal();
      swalSuccessModal({
        title: '비밀번호가 성공적으로\n초기화되었습니다.',
      });
    } catch (err) {
      if (isError) {
        swalErrorModal({
          title: '비밀번호 초기화 실패',
          text: error?.message || '비밀번호 초기화 중 오류가 발생했습니다.',
        });
      } else {
        swalErrorModal({
          title: '비밀번호 초기화 실패',
          text:
            err?.response?.data?.error?.message ||
            '비밀번호 초기화 중 오류가 발생했습니다.',
        });
      }
    }
  };
</script>

<template>
  <template v-if="!isAptDetailLoading">
    <section class="w-full border-b border-b-dark-100 p-8">
      <ButtonBack />
      <div class="flex items-end justify-between">
        <div>
          <h2 class="pretendard-h3">
            {{ aptDetail?.name || '단지 상세 정보' }}
          </h2>
          <div
            class="flex items-center gap-1 text-base leading-7 text-muted-foreground-100"
          >
            <span class="font-medium">등록일</span>
            <span class="font-bold">{{
              aptDetail?.createdDate || '정보없음'
            }}</span>
          </div>
        </div>
        <ModalReconfirm
          v-if="aptDetail !== undefined"
          trigger-button-name=" 단지 삭제 처리"
          title="정말로 단지 삭제 처리를 하시겠습니까?"
          paragraph="삭제 처리 후 복구될 수 없습니다. 해당 단지 정보가 모두 삭제됩니다. 삭제 처리할 단지명을 정확하게 입력해주세요."
          :placeholder="aptDetail?.name"
          field-id="aptName"
          color="red"
          close-button-name="삭제 처리"
        />
      </div>
    </section>
    <template v-if="aptDetail !== undefined">
      <section class="border-b border-b-dark-100 p-8">
        <div class="mb-6 flex justify-between">
          <h3 class="flex items-center pretendard-h4">기본 정보</h3>
          <AptModal mode="edit" :apt-detail="aptDetail" />
        </div>
        <ul class="flex flex-col gap-6 text-sm font-normal leading-[14px]">
          <li
            v-for="info in APT_DETAILS_BASIC_INFO_LIST"
            :key="info.key"
            class="flex"
          >
            <span class="w-[200px] font-semibold">{{ info.label }}</span>
            <span v-if="info.key === 'aptTel'">
              {{ formatContact(aptDetail?.aptTel) }}
            </span>
            <span
              v-else-if="
                info.key === 'householdCount' ||
                info.key === 'parkingSpaceCount'
              "
              >{{ aptDetail?.[info.key]?.toLocaleString('en-US') }}</span
            >
            <template v-else-if="info.key === 'contentList'">
              <div class="flex flex-wrap gap-2 whitespace-nowrap">
                <ChipBase
                  v-for="content in aptDetail?.contentList"
                  :key="content?.uuid"
                  color="gray-20"
                  variant="fill"
                >
                  {{ content.name }}
                </ChipBase>
              </div>
            </template>
            <span v-else>{{
              aptDetail ? aptDetail[info.key] : undefined
            }}</span>
          </li>
        </ul>
      </section>
      <section class="border-b border-b-dark-100 p-8 pretendard-h4">
        <h3 class="mb-6 flex items-center gap-2 pretendard-h4">
          <span>동호수 정보</span>
          <span v-if="!aptDetail?.useFlag">
            <IconErrorInfoRed class="h-4 w-4" aria-hidden="true" />
          </span>
        </h3>
        <ul class="flex flex-col gap-6 text-sm font-normal leading-[14px]">
          <li class="flex items-center">
            <span class="w-[200px] font-semibold">세대 동호수</span>
            <div class="flex items-center gap-2">
              <span>{{
                `총 ${formatNumber(aptDetail?.householdDongCount)}개동 · ${formatNumber(
                  aptDetail?.houseHoldHoCount,
                )}세대`
              }}</span>
              <button type="button" @click="handleHouseHouseholdNumberButton">
                <IconArrowUpRight class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
          <li class="flex items-center">
            <span class="w-[200px] font-semibold">상가 동호수</span>
            <div class="flex items-center gap-2">
              <span>{{
                `총 ${formatNumber(aptDetail?.storeDongCount)}개동 · ${formatNumber(
                  aptDetail?.storeHoCount,
                )}세대`
              }}</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="border-b border-b-dark-100 p-8 pretendard-h4">
        <h3 class="mb-6 flex items-center pretendard-h4">
          단지관리자 계정 정보
        </h3>
        <ul class="flex flex-col gap-6 text-sm font-normal leading-[14px]">
          <li class="flex">
            <span class="w-[200px] font-semibold">단지 최고관리자 ID</span>
            <span>{{
              aptDetail?.aptAdminIdList?.join(', ') ||
              aptDetail?.aptAdminIdList?.[0] ||
              ''
            }}</span>
          </li>
          <li class="flex">
            <span class="w-[200px] font-semibold">비밀번호</span>
            <ModalBase
              ref="passwordResetModalRef"
              :has-form="true"
              form-id="passwordResetForm"
              title="비밀번호 초기화하기"
              @form-submit="handleFormSubmit"
            >
              <template #button>
                <ButtonBase
                  type="button"
                  color="secondary-fill"
                  custom-class="select-none"
                  @click="handleOpenModal"
                >
                  비밀번호 초기화
                </ButtonBase>
              </template>
              <template #modalBody>
                <ul class="flex flex-col gap-4">
                  <li class="flex flex-col gap-2">
                    <LabelBase
                      label-for="initialPassword"
                      label-text="초기 비밀번호"
                      asterisk
                    >
                      <div class="relative w-full">
                        <Field
                          id="initialPassword"
                          name="initialPassword"
                          :type="showPasswordRef ? 'text' : 'password'"
                          class="w-full rounded-md border px-3 py-2"
                        />
                        <button
                          type="button"
                          class="absolute inset-y-0 right-0 flex items-center px-2"
                          @click="togglePasswordVisibility"
                        >
                          <component
                            :is="showPasswordRef ? EyeOnIcon : EyeOffIcon"
                            class="h-4 w-4"
                          />
                        </button>
                      </div>
                    </LabelBase>
                    <TextError v-if="errors.initialPassword">{{
                      errors.initialPassword
                    }}</TextError>
                  </li>
                </ul>
              </template>
              <template #submitButton>
                <ButtonBase
                  form="passwordResetForm"
                  type="submit"
                  color="primary"
                  custom-class="w-full"
                  :disabled="errors.initialPassword"
                >
                  <div
                    v-if="isPasswordInitLoading"
                    class="flex items-center justify-center gap-2"
                  >
                    <span>설정중..</span>
                    <SpinnerWhiteView />
                  </div>
                  <div v-else class="w-full">설정하기</div>
                </ButtonBase>
              </template>
            </ModalBase>
          </li>
        </ul>
      </section>
    </template>
    <EmptyView v-else />
  </template>
</template>
