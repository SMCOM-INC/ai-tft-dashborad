<script setup>
  import SelectBoxBase from '@components/common/SelectBoxBase.vue';
  import { computed } from 'vue';

  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    inspectionList: {
      type: Array,
      default: () => [],
    },
    selectedUuid: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const emits = defineEmits(['select']);

  const inspectionOptions = computed(() =>
    props.inspectionList.map((item) => ({
      key: item.fireInspectionUuid,
      label: `${decodeUrl(item.title)}`,
    })),
  );

  const selectedInspection = computed(() => {
    const firstInspectionUuid = inspectionOptions.value[0];

    if (!props.selectedUuid) return firstInspectionUuid || null;

    return (
      inspectionOptions.value.find((opt) => opt.key === props.selectedUuid) ||
      firstInspectionUuid ||
      null
    );
  });

  const handleSelectInspection = (option) => {
    emits('select', option.key);
  };
</script>

<template>
  <div class="flex h-10 min-w-72 max-w-72 border-r pr-4">
    <SelectBoxBase
      :option-list="inspectionOptions"
      :value="selectedInspection || {}"
      :disabled="disabled"
      class="mb-3"
      @select-value="handleSelectInspection"
    />
  </div>
</template>
