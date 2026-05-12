<script setup>
  import ChevronDownIcon from '@assets/icons/icon-chevron-down-black.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';


  const props = defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    optionList: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
      default: '',
    },
    labelText: {
      type: String,
      required: true,
    },
    loadingValue: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
  const emit = defineEmits(['update:modelValue']);

  const handleChange = (event) => {
    emit('update:modelValue', event.target.value);
  };
</script>
<template>
  <li class="flex flex-col gap-2">
    <LabelBase :label-for="id" :label-text="labelText" asterisk />
    <div class="relative">
      <Field
        :id="id"
        v-slot="{ field }"
        :name="id"
        :class="errors[id] ? 'border-red-500' : ''"
        @input="handleChange"
      >
        <select
          v-bind="field"
          class="z-10 w-full cursor-pointer appearance-none rounded-md border py-2 pl-3 pr-[38px] text-sm font-medium disabled:bg-foreground-10 disabled:text-foreground-50"
        >
          <option value="">
            {{
              optionList.length === 0
                ? '등록된 게이트 목록이 없습니다.'
                : '게이트를 선택해주세요.'
            }}
          </option>
          <SpinnerWhiteView v-if="props.loadingValue" />
          <template v-else>
            <option
              v-for="option in optionList"
              :key="option.id || option.lprUuid"
              :value="option.name || option.lprUuid"
            >
              {{ option.name || option.lprName }}
            </option>
          </template>
        </select>
      </Field>
      <ChevronDownIcon
        class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
    <TextError v-if="errors[id]" class="-mt-2">
      {{ errors[id] }}
    </TextError>
  </li>
</template>
