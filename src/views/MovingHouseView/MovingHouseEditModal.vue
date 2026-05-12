<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import MovingHouseForm from '@views/MovingHouseView/MovingHouseForm.vue';
  import { useForm } from 'vee-validate';

  import { MOVING_HOUSE_EDIT_DEFAULT_FIELD } from '@/constants/movingHouse.js';

  const emits = defineEmits(['close', 'edit']);

  const closeModal = () => {
    emits('close');
  };

  const { errors } = useForm({
    validationMode: 'onSubmit',
  });

  const handleFormSubmit = () => {
    emits('edit');
    closeModal();
  };
</script>

<template>
  <div
    class="fixed left-[0px] top-[0px] z-50 flex h-screen w-screen items-center justify-center bg-black/50 p-5"
    @click="closeModal"
  >
    <div class="absolute min-w-[400px] rounded-md bg-white" @click.stop>
      <h1 class="border-b border-b-[#E2E8F0] px-6 py-4 pretendard-h4">
        예약 수정하기
      </h1>
      <div class="flex flex-col gap-6 p-6">
        <ul
          class="border-border flex justify-between gap-4 rounded-[4px] border bg-secondary-100 px-4 py-3"
        >
          <li
            v-for="field in MOVING_HOUSE_EDIT_DEFAULT_FIELD"
            :key="field.key"
            class="flex gap-2"
          >
            <span class="font-semibold text-secondary-foreground-100">
              {{ field.label }}
            </span>
            <span class="text-muted-foreground-100">101</span>
          </li>
        </ul>
        <ul>
          <MovingHouseForm :errors="errors" form-type="edit" />
        </ul>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            custom-class="inline"
            @click="closeModal"
          >
            닫기
          </ButtonBase>
          <ButtonBase type="submit" color="primary" @click="handleFormSubmit">
            수정
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>
