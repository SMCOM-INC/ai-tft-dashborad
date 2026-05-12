<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import { Field } from 'vee-validate';
</script>

<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="nickName" label-text="닉네임">
      <Field
        id="nickName"
        type="text"
        name="nickName"
        class="w-full rounded-md border px-3 py-2"
      />
    </LabelBase>
  </li>
</template>
