<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';

  const props = defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });
</script>

<template>
  <li class="flex w-full flex-col">
    <LabelBase label-for="memo" label-text="메모">
      <Field
        id="memo"
        type="text"
        name="memo"
        class="w-full rounded-md border px-3 py-2"
        :class="props.errors?.memo ? 'border-red-500' : ''"
        maxlength="30"
      />
    </LabelBase>
    <TextError v-if="props.errors?.memo" class="mt-1"
      >{{ props.errors?.memo }}
    </TextError>
  </li>
</template>
