<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { useField } from 'vee-validate';

  const props = defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const { value: carNum, handleChange } = useField('carNum');

  // 띄어쓰기 제거 함수
  const removeSpaces = (e) => {
    const newValue = e.target.value.replace(/\s/g, '');
    handleChange(newValue);
  };
</script>

<template>
  <li class="flex flex-col">
    <LabelBase label-for="carNum" label-text="차량 번호" asterisk>
      <input
        id="carNum"
        v-model="carNum"
        type="text"
        name="carNum"
        class="w-full rounded-md border px-3 py-2"
        :class="props.errors?.carNum ? 'border-red-500' : ''"
        @input="removeSpaces"
      />
    </LabelBase>
    <TextError v-if="props.errors?.carNum">{{
      props.errors?.carNum
    }}</TextError>
  </li>
</template>
