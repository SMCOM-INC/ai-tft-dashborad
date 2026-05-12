<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';

  defineProps({
    errors: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div>
    <LabelBase
      label-for="pushFlag"
      label-text="푸시 알림 전송 여부"
      class="gap-4"
      asterisk
    >
      <ul class="flex gap-4">
        <li class="flex gap-2 rounded-md border p-3">
          <Field id="pushFlagY" name="pushFlag" type="radio" :value="true" />
          <LabelBase label-for="pushFlagY" label-text="푸시 알림 전송" />
        </li>
        <li class="flex gap-2 rounded-md border p-3">
          <Field id="pushFlagN" name="pushFlag" type="radio" :value="false" />
          <LabelBase label-for="pushFlagN" label-text="푸시 알림 미전송" />
        </li>
      </ul>
    </LabelBase>
    <TextError v-if="errors.pushFlag">{{ errors.pushFlag }}</TextError>
  </div>
</template>
