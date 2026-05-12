<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldCarNum from '@components/common/ModalFieldCarNum.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldMemo from '@components/common/ModalFieldMemo.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import ModalFieldVisitPurpose from '@components/common/ModalFieldVisitPurpose.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { computed, watch } from 'vue';

  import useWallPadContent from '@/lib/composables/parking/useWallPadContent.js';
  import usePostAlwaysAllow from '@/lib/queries/parkingAlwaysAllow/usePostAlwaysAllow.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import {
    alwaysAllowFormSchema,
    alwaysAllowFormSchemaWithWallPadAlarm,
  } from '@/schemas/parking.js';

  const emits = defineEmits(['close', 'success']);

  const { hasWallPadUI } = useWallPadContent();

  const schema = computed(() => {
    if (hasWallPadUI) {
      return toTypedSchema(alwaysAllowFormSchemaWithWallPadAlarm);
    }
    return toTypedSchema(alwaysAllowFormSchema);
  });

  const { errors, defineField, handleSubmit } = useForm({
    validationSchema: schema,
  });

  const [parkingWallPadAlarm] = defineField('parkingWallPadAlarm');

  const {
    postAlwaysAllowMutation,
    isPostAlwaysAllowPending,
    isPostAlwaysAllowSuccess,
  } = usePostAlwaysAllow();

  const onSubmit = handleSubmit((submitValues) => {
    swalConfirmModal({
      title: '항상허용 등록',
      text: '항상허용을 등록하시겠습니까?',
      callback: () => {
        postAlwaysAllowMutation({
          carNum: submitValues.carNum,
          dong: submitValues.dong,
          ho: submitValues.ho,
          phone: submitValues.phone,
          visitPurposeUuid: submitValues.visitPurposeUuid,
          memo: submitValues.memo,
          parkingWallPadAlarm: submitValues.parkingWallPadAlarm,
        });
      },
    });
  });

  const closeModal = () => {
    emits('close');
  };

  watch(
    () => isPostAlwaysAllowSuccess.value,
    () => {
      closeModal();
      emits('success');
    },
  );
</script>

<template>
  <ModalBaseNew>
    <div
      class="max-h-[80vh] w-full max-w-[512px] overflow-y-auto rounded-lg bg-white p-6"
    >
      <header class="mb-4 flex items-center justify-between">
        <h1 class="select-none text-lg font-medium">항상허용 등록하기</h1>
        <button type="button" class="w-fit" @click="closeModal">
          <CloseIcon class="h-5" aria-hidden="true" />
        </button>
      </header>
      <form id="createAlwaysAllowForm" @submit="onSubmit">
        <ul class="flex flex-col gap-4">
          <!-- 차량번호 -->
          <ModalFieldCarNum :errors="errors" />
          <!-- 동호수 -->
          <ModalFieldDongHo :errors="errors" asterisk />
          <!-- 연락처 -->
          <ModalFieldPhone id="phone" :errors="errors" label-text="연락처" />
          <!-- 방문목적 -->
          <ModalFieldVisitPurpose :errors="errors" />
          <!-- 메모 -->
          <ModalFieldMemo :errors="errors" />
          <!-- 입출차 시 월패드 알림 -->
          <li v-if="hasWallPadUI" class="flex flex-col gap-2">
            <LabelBase
              label-for="parkingWallPadAlarm"
              label-text="입출차 시 월패드 알림"
              asterisk
            />
            <div>
              <ul class="flex w-full gap-2">
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="parkingWallPadAlarm-yes"
                    v-model="parkingWallPadAlarm"
                    type="radio"
                    name="parkingWallPadAlarm"
                    :value="true"
                  />
                  <LabelBase
                    label-for="parkingWallPadAlarm-yes"
                    label-text="예"
                  />
                </li>
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="parkingWallPadAlarm-no"
                    v-model="parkingWallPadAlarm"
                    type="radio"
                    name="parkingWallPadAlarm"
                    :value="false"
                  />
                  <LabelBase
                    label-for="parkingWallPadAlarm-no"
                    label-text="아니오"
                  />
                </li>
              </ul>
              <TextError v-if="errors.parkingWallPadAlarm">{{
                errors.parkingWallPadAlarm
              }}</TextError>
            </div>
          </li>
        </ul>
        <div class="pt-6">
          <ButtonBase
            form="createAlwaysAllowForm"
            type="submit"
            color="primary"
            custom-class="w-full"
          >
            <div
              v-if="isPostAlwaysAllowPending"
              class="flex items-center justify-center gap-2"
            >
              <span>등록중..</span>
              <SpinnerWhiteView />
            </div>
            <div class="w-full">등록하기</div>
          </ButtonBase>
        </div>
      </form>
    </div>
  </ModalBaseNew>
</template>
