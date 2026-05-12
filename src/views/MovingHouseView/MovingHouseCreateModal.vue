<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import MovingHouseForm from '@views/MovingHouseView/MovingHouseForm.vue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  import { useCreateMoveHouseReservation } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { movingHouseReservationFormSchema } from '@/schemas/movingHouse.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const isModalOpen = ref(false);

  const { errors, handleSubmit, resetForm } = useForm({
    validationSchema: movingHouseReservationFormSchema,
  });

  const {
    createMoveHouseReservationMutation,
    isCreateMoveHouseReservationPending,
  } = useCreateMoveHouseReservation(aptUuid);

  const handleOpenModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    resetForm();
  };

  const onSubmit = handleSubmit((submitValues) => {
    swalConfirmModal({
      title: '이사예약 등록',
      text: '이사예약을 등록하시겠습니까?',
      callback: async () => {
        await createMoveHouseReservationMutation({
          moveType: submitValues.moveType,
          residentName: submitValues.residentName,
          emergencyPhone: submitValues.emergencyPhone,
          dong: submitValues.dong,
          ho: submitValues.ho,
          moveDate: formatDateObject(submitValues.moveDate, 'hyphen'),
          moveReservationTimeUuid: submitValues.moveReservationTimeUuid,
          depositDate: formatDateObject(submitValues.depositDate, 'hyphen'),
          depositorName: submitValues.depositorName,
          memo: submitValues.memo || null,
        });

        closeModal();
      },
    });
  });

  watch(isModalOpen, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
</script>

<template>
  <div>
    <ButtonBase
      type="button"
      color="primary"
      custom-class="inline"
      @click="handleOpenModal"
    >
      예약 등록하기
    </ButtonBase>

    <ModalBaseNew v-if="isModalOpen">
      <div class="flex max-h-[80vh] w-[600px] flex-col overflow-y-auto">
        <div class="flex items-center justify-between border-b p-6">
          <h2 class="pretendard-700 text-lg">이사예약 등록</h2>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center"
            @click="closeModal"
          >
            <CloseIcon class="h-6 w-6" />
          </button>
        </div>

        <form
          id="movingHouseCreateForm"
          class="flex flex-col gap-6 p-6"
          @submit="onSubmit"
        >
          <MovingHouseForm :errors="errors" />

          <div class="flex gap-2">
            <ButtonBase
              type="button"
              color="secondary"
              custom-class="w-full"
              @click="closeModal"
            >
              취소
            </ButtonBase>
            <ButtonBase
              type="submit"
              color="primary"
              custom-class="w-full"
              form="movingHouseCreateForm"
              :disabled="isCreateMoveHouseReservationPending"
            >
              <div
                v-if="isCreateMoveHouseReservationPending"
                class="flex items-center justify-center gap-2"
              >
                <span>등록중..</span>
                <SpinnerWhiteView />
              </div>
              <div v-else class="w-full">등록하기</div>
            </ButtonBase>
          </div>
        </form>
      </div>
    </ModalBaseNew>
  </div>
</template>
