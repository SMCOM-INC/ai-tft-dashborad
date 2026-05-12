<script setup>
  import ChevronDownIcon from '@assets/icons/icon-chevron-down-black.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';

  import { useFetchAptVisitPurposeList } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';

  const props = defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    selectedVisitPurposeUuid: {
      type: String,
      required: false,
      default: '',
    },
  });

  const emit = defineEmits(['update:selectedVisitPurposeUuid']);

  const { aptVisitPurposeList, isAptVisitPurposeListLoading } =
    useFetchAptVisitPurposeList({ usedOnly: true });

  const handleChange = (event) => {
    emit('update:selectedVisitPurposeUuid', event.target.value);
  };
</script>
<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="visitPurposeUuid" label-text="방문 목적" asterisk />
    <SkeletonBar v-if="isAptVisitPurposeListLoading" />
    <div v-else class="relative">
      <Field
        id="visitPurposeUuid"
        v-slot="{ field }"
        name="visitPurposeUuid"
        :value="selectedVisitPurposeUuid"
        :class="props.errors?.visitPurposeUuid ? 'border-red-500' : ''"
        @input="handleChange"
      >
        <select
          v-bind="field"
          class="z-10 w-full cursor-pointer appearance-none rounded-md border py-2 pl-3 pr-[38px] text-sm font-medium disabled:bg-foreground-10 disabled:text-foreground-50"
        >
          <option value="">
            {{
              aptVisitPurposeList.length === 0
                ? '등록된 방문 목적이 없습니다.'
                : '방문 목적을 선택해주세요.'
            }}
          </option>
          <option
            v-for="option in aptVisitPurposeList"
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
    <TextError v-if="errors.visitPurposeUuid" class="-mt-2">
      {{ errors.visitPurposeUuid }}
    </TextError>
  </li>
</template>
