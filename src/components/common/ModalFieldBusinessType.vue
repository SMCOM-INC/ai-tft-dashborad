<script setup>
  import ChevronDownIcon from '@assets/icons/icon-chevron-down-black.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';

  import { useFetchAptBusinessTypeList } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';

  const props = defineProps({
    errors: {
      type: Object,
      required: true,
    },
  });

  const { aptBusinessTypeList, isAptBusinessTypeListLoading } =
    useFetchAptBusinessTypeList({
      enabled: true,
      usedOnly: true,
    });
</script>
<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="businessTypeUuid" label-text="업무 목적" asterisk />
    <SkeletonBar v-if="isAptBusinessTypeListLoading" />
    <div v-else class="relative">
      <Field
        id="businessTypeUuid"
        v-slot="{ field }"
        name="businessTypeUuid"
        :class="props.errors?.businessTypeUuid ? 'border-red-500' : ''"
      >
        <select
          v-bind="field"
          class="z-10 w-full cursor-pointer appearance-none rounded-md border py-2 pl-3 pr-[38px] text-sm font-medium disabled:bg-foreground-10 disabled:text-foreground-50"
        >
          <option value="">
            {{
              aptBusinessTypeList.length === 0
                ? '등록된 업무 목적이 없습니다.'
                : '업무 목적을 선택해주세요.'
            }}
          </option>
          <option
            v-for="option in aptBusinessTypeList"
            :key="option.uuid"
            :value="option.uuid"
          >
            {{ option.name }}
          </option>
        </select>
      </Field>
      <ChevronDownIcon
        class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
    <TextError v-if="errors.businessTypeUuid" class="-mt-2">
      {{ errors.businessTypeUuid }}
    </TextError>
  </li>
</template>
