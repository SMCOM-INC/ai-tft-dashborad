<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import { computed } from 'vue';

  import { STATE_TYPE } from '@/constants/common.js';

  const props = defineProps({
    state: { type: String, required: true },
  });

  const findStateType = (key) => {
    const finedType = STATE_TYPE.find((type) => type.key === key);

    return finedType?.label;
  };

  const convertedState = computed(() => findStateType(props.state));
</script>

<template>
  <ChipBase
    :color="
      convertedState === '대기'
        ? 'gray-20'
        : convertedState === '승인'
          ? 'blue-100'
          : 'red-100'
    "
    :variant="convertedState === '반려' ? 'fill' : 'outline'"
    class="w-12 select-none"
  >
    {{ convertedState }}
  </ChipBase>
</template>
