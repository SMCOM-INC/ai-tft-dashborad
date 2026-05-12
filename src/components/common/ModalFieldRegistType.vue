<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';
  import { ref, watch } from 'vue';

  import { REGISTRATION_TYPE } from '@/constants/parking.js';

  const props = defineProps({
    errors: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const selectedType = ref(props.modelValue);

  watch(selectedType, (newValue) => {
    emit('update:modelValue', newValue);
  });
</script>

<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="registType" label-text="구분" asterisk />
    <ul class="flex w-full gap-2">
      <li
        v-for="type in REGISTRATION_TYPE"
        :key="type.key"
        class="flex w-full gap-2 rounded-md border p-3"
      >
        <Field
          :id="`registType-${type.key}`"
          v-model="selectedType"
          name="registType"
          type="radio"
          :value="type.key"
          :disabled="props.disabled"
        />
        <LabelBase
          :label-for="`registType-${type.key}`"
          :label-text="type.label"
        />
      </li>
    </ul>
    <TextError v-if="props.errors?.registType">{{
      props.errors?.registType
    }}</TextError>
  </li>
</template>
