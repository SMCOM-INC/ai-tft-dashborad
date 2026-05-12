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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    asterisk: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const { value: dong, handleChange: handleDongChange } = useField('dong');
  const { value: ho, handleChange: handleHoChange } = useField('ho');

  // 띄어쓰기 제거 함수
  const removeSpaces = (event, id) => {
    const newValue = event.target.value.replace(/\s/g, '');

    if (id === 'dong') {
      handleDongChange(newValue);
    } else {
      handleHoChange(newValue);
    }
  };
</script>

<template>
  <li class="flex w-full gap-2">
    <div class="flex w-1/2 flex-col">
      <LabelBase
        label-for="dong"
        label-text="동"
        :asterisk="asterisk"
        class="w-full"
      >
        <input
          id="dong"
          v-model="dong"
          type="text"
          min="1"
          name="dong"
          class="w-full rounded-md border px-3 py-2"
          :class="props.errors?.dong ? 'border-red-500' : ''"
          :disabled="props.disabled"
          @input="(event) => removeSpaces(event, 'dong')"
        />
      </LabelBase>
      <TextError v-if="props.errors?.dong">{{ props.errors?.dong }}</TextError>
    </div>
    <div class="flex w-1/2 flex-col">
      <LabelBase
        label-for="ho"
        label-text="호수"
        :asterisk="asterisk"
        class="w-full"
      >
        <input
          id="ho"
          v-model="ho"
          type="text"
          min="1"
          name="ho"
          class="w-full rounded-md border px-3 py-2"
          :class="props.errors?.ho ? 'border-red-500' : ''"
          :disabled="props.disabled"
          @input="(event) => removeSpaces(event, 'ho')"
        />
      </LabelBase>
      <TextError v-if="props.errors?.ho">{{ props.errors?.ho }}</TextError>
    </div>
  </li>
</template>
