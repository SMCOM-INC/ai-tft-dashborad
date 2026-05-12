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
  <li class="flex flex-col gap-2">
    <LabelBase
      label-for="householdHeadFlag"
      label-text="세대주 여부"
      asterisk
    />
    <ul class="flex gap-2">
      <li class="flex gap-2 rounded-md border p-3">
        <Field
          id="householdHead"
          name="householdHeadFlag"
          type="radio"
          value="householdHead"
        />
        <LabelBase label-for="householdHead" label-text="세대주" />
      </li>
      <li class="flex gap-2 rounded-md border p-3">
        <Field
          id="householdMember"
          name="householdHeadFlag"
          type="radio"
          value="householdMember"
        />
        <LabelBase label-for="householdMember" label-text="세대원" />
      </li>
    </ul>
    <TextError v-if="props.errors?.householdHeadFlag" class="mt-1">{{
      props.errors?.householdHeadFlag
    }}</TextError>
  </li>
</template>
