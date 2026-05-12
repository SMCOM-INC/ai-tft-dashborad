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
  });

  const { value: name } = useField(props.id);
</script>

<template>
  <li class="flex w-full flex-col">
    <LabelBase :label-for="id" label-text="이름" asterisk>
      <input
        :id="id"
        v-model="name"
        type="text"
        :name="id"
        class="w-full rounded-md border px-3 py-2"
        :class="errors?.[id] ? 'border-red-500' : ''"
        :disabled="disabled"
      />
    </LabelBase>
    <TextError v-if="errors?.[id]" class="mt-1">{{ errors?.[id] }}</TextError>
  </li>
</template>
