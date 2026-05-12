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
  });
</script>
<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="carType" label-text="차량 유형" asterisk />
    <div class="relative">
      <Field
        id="carType"
        v-slot="{ field }"
        name="carType"
        :class="props.errors?.carType ? 'border-red-500' : ''"
      >
        <select
          v-bind="field"
          class="z-10 w-full cursor-pointer appearance-none rounded-md border py-2 pl-3 pr-[38px] text-sm font-medium disabled:bg-foreground-10 disabled:text-foreground-50"
        >
          <option value="">
            {{
              optionList.length === 0
                ? '등록된 차량 유형이 없습니다.'
                : '차량 유형을 선택해주세요.'
            }}
          </option>
          <SpinnerWhiteView v-if="props.loadingValue" />
          <!--       실제 옵션 보여주는 곳-->
          <template v-else>
            <option
              v-for="option in optionList"
              :key="option.key"
              :value="option.key"
            >
              {{ option.name }}
            </option>
          </template>
        </select>
      </Field>
      <ChevronDownIcon
        class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
    <TextError v-if="errors.carType" class="-mt-2">
      {{ errors.carType }}
    </TextError>
  </li>
</template>
