<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import { computed } from 'vue';

  import { REPAIR_STATUS_LIST_COLOR } from '@/constants/repair.js';

  const props = defineProps({
    state: { type: String, required: true },
  });

  const findStatus = computed(() =>
    REPAIR_STATUS_LIST_COLOR.find((item) => item.state === props.state),
  );
</script>

<template>
  <ChipBase :color="findStatus?.color" variant="fill" class="w-fit select-none">
    {{ findStatus?.label }}
  </ChipBase>
</template>
