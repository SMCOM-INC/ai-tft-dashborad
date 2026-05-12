<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';

  import { FIELD_LABELS } from '@/constants/fireInspection.js';

  const props = defineProps({
    errors: {
      type: Object,
      required: true,
      validator: (value) => Object.keys(value).length > 0,
    },
  });

  const emits = defineEmits(['close']);

  const FIELD_ORDER = [
    'inspector',
    'submissionType',
    'inspectorPhone',
    'submissionDateTime',
    'inspectionQuestions',
  ];

  const sortedErrors = computed(() => {
    return FIELD_ORDER.filter((field) => field in props.errors).map(
      (field) => ({
        field,
        message: props.errors[field],
      }),
    );
  });

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-6 space-y-3">
        <h1 class="pretendard-18Medium">입력 정보를 확인해주세요</h1>
        <ul class="space-y-2">
          <li
            v-for="{ field, message } in sortedErrors"
            :key="field"
            class="flex items-start gap-1.5 pretendard-14Regular"
          >
            <span class="text-defaults-primary-text-error mt-0.5">•</span>
            <span>
              <span
                class="text-defaults-primary-text-primary pretendard-14SemiBold"
              >
                {{ FIELD_LABELS[field] || field }}
              </span>
              <span class="text-defaults-secondary-text-secondary">
                : {{ message }}
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div class="flex justify-end">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          @click="closeModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
