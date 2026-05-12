<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';

  defineProps({
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    inputType: {
      type: String,
      required: true,
      default: '',
    },
    id: {
      type: String,
      required: true,
      default: '',
    },
    labelText: {
      type: String,
      required: true,
      default: '',
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: true,
    },
  });
</script>

<template>
  <li class="flex flex-col">
    <LabelBase :label-for="id" :label-text="labelText" :asterisk="isRequired">
      <Field
        :id="id"
        :type="inputType"
        :name="id"
        class="w-full rounded-md border px-3 py-2"
        :disabled="disabled"
      />
    </LabelBase>
    <TextError v-if="errors[id]">{{ errors[id] }}</TextError>
  </li>
</template>
