<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useField } from 'vee-validate';
  // import { computed } from 'vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    // size: {
    //   type: String,
    //   required: true,
    //   validator(value) {
    //     return ['lg', 'xl'].includes(value);
    //   },
    // },
    label: {
      type: String,
      required: false,
      default: '',
    },
    enableTimePicker: {
      type: Boolean,
      required: false,
      default: false,
    },
    local: {
      type: String,
      required: false,
      default: 'ko',
    },
    placeholder: {
      type: String,
      required: false,
      default: '연-월-일',
    },
    format: {
      type: String,
      required: false,
      default: 'yyyy-MM-dd',
    },
    autoApply: {
      type: Boolean,
      required: false,
      default: true,
    },
    minDate: {
      type: Date,
      required: false,
      default: new Date(),
    },
    // required: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    error: {
      type: String,
      required: false,
      default: '',
    },
    hint: {
      type: String,
      required: false,
      default: '',
    },
    // classCustom: {
    //   type: String,
    //   required: false,
    //   default: '',
    // },
  });

  const { value } = useField(props.id);

  // const convertSize = computed(() => {
  //   switch (props.size) {
  //     case 'lg':
  //       return 'pretendard-14Regular';
  //     case 'xl':
  //       return 'pretendard-16Regular';
  //     default:
  //       return props.size;
  //   }
  // });
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <label
      v-if="!!label"
      :for="id"
      class="text-defaults-secondary-text-secondary pretendard-16Medium"
      >{{ label }}</label
    >
    <VueDatePicker
      v-model="value"
      :locale="local"
      :enable-time-picker="enableTimePicker"
      :auto-apply="autoApply"
      :format="format"
      :placeholder="placeholder"
      :min-date="minDate"
      class="custom-picker"
    />
    <p v-if="!!error" class="text-alerts-error-text-error pretendard-14Regular">
      {{ error }}
    </p>
    <p
      v-else-if="!!hint"
      class="text-defaults-tertiary-text-tertiary pretendard-14Regular"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
  .custom-picker {
    --dp-border-color: #d2d6db;
    --dp-hover-color: #e5e7eb;
  }
</style>
