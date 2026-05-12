<script setup>
  import vSelect from 'vue-select';

  defineProps({
    modelValue: {
      type: [String, Number, Object, Array],
      default: null,
    },
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    noResultText: {
      type: String,
      default: '일치하는 옵션이 없습니다.',
    },
    label: {
      type: String,
      default: 'label',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      type: String,
      default: '250px',
    },
    maxHeight: {
      type: String,
      default: '400px',
    },
    customClass: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'optionSelected',
    'search',
    'open',
    'close',
  ]);
  const handleSelect = (option) => {
    emit('optionSelected', option);
  };
</script>

<template>
  <vSelect
    :model-value="modelValue"
    :options="options"
    :placeholder="placeholder"
    :label="label"
    :reduce="(option) => option[valueKey]"
    :multiple="multiple"
    :searchable="searchable"
    :clearable="clearable"
    :loading="loading"
    :disabled="disabled"
    :class="['custom-select', customClass]"
    @update:model-value="$emit('update:modelValue', $event)"
    @option:selected="handleSelect"
    @search="$emit('search', $event)"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #no-options>
      <slot name="no-options">{{ noResultText }}</slot>
    </template>
    <template #option="option">
      <slot name="option" v-bind="option">
        {{ option[label] }}
      </slot>
    </template>
    <template #selected-option="option">
      <slot name="selected-option" v-bind="option">
        {{ option[label] }}
      </slot>
    </template>
  </vSelect>
</template>
<style scoped>
  .custom-select.v-select {
    min-width: v-bind('minWidth');
    max-width: 100%;
    z-index: 100;
  }

  .custom-select.v-select .vs__dropdown-toggle {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
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
    max-height: v-bind('maxHeight');
    min-width: v-bind('minWidth');
    z-index: 100;
  }
</style>
