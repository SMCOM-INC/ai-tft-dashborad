<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import InputText from '@components/common/InputText.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import usePostFireInspection from '@/lib/queries/fireInspection/usePostFireInspection.js';
  import { fireInspectionCreateFormSchema } from '@/schemas/fireInspection.js';

  const emits = defineEmits(['close']);

  const { meta, handleSubmit, errors, defineField } = useForm({
    validationSchema: fireInspectionCreateFormSchema,
  });

  const [title] = defineField('title');
  const [dateRange] = defineField('dateRange');

  const { createFireInspectionMutationAsync, isCreateFireInspectionPending } =
    usePostFireInspection();

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (values) => {
    await createFireInspectionMutationAsync({
      title: values.title,
      startDate: values.dateRange[0],
      endDate: values.dateRange[1],
    });

    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[606px]">
      <!-- Header -->
      <header
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">신규 점검 등록</h1>
        <button
          type="button"
          :disabled="isCreateFireInspectionPending"
          @click="closeModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </header>

      <!-- Form -->
      <form id="inspectionCreateForm" class="px-6 py-6" @submit="onSubmit">
        <div class="rounded-md border border-defaults-primary-border-primary">
          <table class="w-full">
            <tbody>
              <!-- Row 1: 점검 제목  -->
              <tr class="border-b border-b-defaults-primary-border-primary">
                <th
                  class="w-32 rounded-tl-md bg-defaults-secondary-background-secondary px-6 py-4 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
                >
                  점검 제목
                </th>
                <td class="px-6 py-4">
                  <InputText
                    id="title"
                    v-model="title"
                    type="text"
                    size="lg"
                    :error="errors.title"
                    placeholder="예) 25-26 소방 자가 점검"
                  />
                </td>
              </tr>

              <!-- Row 2: 점검 기간 -->
              <tr class="border-b border-b-defaults-primary-border-primary">
                <th
                  class="w-32 bg-defaults-secondary-background-secondary px-6 py-4 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
                >
                  점검 기간
                </th>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <DateRangePicker
                      v-model="dateRange"
                      placeholder="YYYY.MM.DD ~ YYY.MM.DD"
                      :min-date="new Date()"
                      :max-date="null"
                      class-name="w-full"
                    />
                    <p
                      v-if="errors.dateRange"
                      class="pt-2 text-sm text-alerts-error-text-error"
                    >
                      {{ errors.dateRange }}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Row 3: 점검 대상 세대 (마지막 행) -->
              <tr class="">
                <th
                  class="w-32 rounded-bl-md bg-defaults-secondary-background-secondary px-6 py-4 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
                >
                  점검 대상 세대
                </th>
                <td class="rounded-br-md px-6 py-4">
                  <span
                    class="text-defaults-primary-text-primary pretendard-14Regular"
                  >
                    전체 입주 세대
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>

      <!-- Footer -->
      <footer
        class="flex justify-end gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)]"
      >
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          class="w-24"
          :disabled="isCreateFireInspectionPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="inspectionCreateForm"
          type="submit"
          :color="meta.valid ? 'primary' : 'primary-disabled'"
          size="md"
          class="flex w-24 items-center justify-center gap-2"
          :disabled="isCreateFireInspectionPending"
        >
          <SpinnerCircle v-if="isCreateFireInspectionPending" />
          <template v-else> 점검 등록 </template>
        </ButtonBase>
      </footer>
    </div>
  </ModalBaseNew>
</template>
