<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';
  import { computed, ref } from 'vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
      default: 'reason',
    },
    label: {
      type: String,
      required: false,
      default: '사유',
    },
    maxLength: {
      type: Number,
      required: false,
      default: 250,
    },
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
    isRequired: {
      type: Boolean,
      required: false,
      default: true,
    },
  });
  const errorMessage = computed(() => props.errors?.[props.id]);
  const inputValue = ref('');
  const inputRef = ref(null);
</script>

<template>
  <li class="flex flex-col">
    <LabelBase :label-for="id" :label-text="label" :asterisk="isRequired">
      <div class="relative">
        <Field
          :id="id"
          ref="inputRef"
          v-model="inputValue"
          as="textarea"
          :maxlength="maxLength"
          :name="id"
          :class="`h-24 w-full resize-none rounded-md border px-3 py-2 focus:border-blue-500 ${errorMessage ? 'border-red-500' : ''}`"
          :disabled="disabled"
        />
        <span class="absolute bottom-2 right-2 text-sm text-gray-500">
          {{ inputValue.length }}/{{ maxLength }}자
        </span>
      </div>
    </LabelBase>
    <TextError v-if="errorMessage" class="-mt-1">{{ errorMessage }}</TextError>
  </li>
</template>
