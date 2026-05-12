<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { useField } from 'vee-validate';

  const props = defineProps({
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

  const { value, setValue, handleChange } = useField(props.id);

  const cleanPhoneNumber = (event) => {
    const cleanedValue = event.target.value.replace(/\D/g, '');
    setValue(cleanedValue);
  };

  const handleInput = (event) => {
    const newValue = event.target.value.replace(/\s/g, '');
    handleChange(newValue);
  };
</script>

<template>
  <li class="flex w-full flex-col">
    <LabelBase :label-for="id" :label-text="labelText" :asterisk="isRequired">
      <input
        :id="id"
        v-model="value"
        type="tel"
        :name="id"
        class="w-full rounded-md border px-3 py-2"
        :class="errors[id] ? 'border-red-500' : ''"
        :disabled="disabled"
        @input="handleInput"
        @blur="cleanPhoneNumber"
      />
    </LabelBase>
    <TextError v-if="errors[id]">{{ errors[id] }}</TextError>
  </li>
</template>
