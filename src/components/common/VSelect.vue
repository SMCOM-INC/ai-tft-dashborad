<script setup>
  import { computed } from 'vue';
  import vSelect from 'vue-select';

  const props = defineProps({
    modelValue: {
      type: [String, Number, Object, Array],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Select option',
    },
    label: {
      type: String,
      default: 'label',
    },
    classes: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'optionSelected']);

  const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const handleSelect = (option) => {
    emit('optionSelected', option);
  };
</script>

<template>
  <vSelect
    v-model="selectedValue"
    :placeholder="placeholder"
    :label="label"
    :loading="loading"
    :options="options"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :class="['custom-select', classes]"
    @option:selected="handleSelect"
  >
    <template #no-options> No matching options. </template>
  </vSelect>
</template>

<style scoped>
  .custom-select.v-select {
    min-width: 250px;
    max-width: 100%;
  }

  .custom-select.v-select .vs__dropdown-toggle {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: lightblue;
  }

  .custom-select.v-select .vs__selected-options {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
  }

  .custom-select.v-select .vs__selected {
    margin: 0;
    padding: 0;
    border: none;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .custom-select.v-select .vs__actions {
    padding: 0;
  }

  .custom-select.v-select .vs__search {
    margin: 0;
    padding: 0;
    border: none;
    min-width: 0;
  }

  .custom-select.v-select .vs__dropdown-menu {
    min-width: 250px;
  }
</style>
