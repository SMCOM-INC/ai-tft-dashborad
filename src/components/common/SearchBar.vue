<script setup>
  import IconCloseDarkGray from '@assets/icons/icon-close-darkGray.svg';
  import IconSearchLineBlack from '@assets/icons/icon-search-line-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';
  import z from 'zod';


  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const props = defineProps({
    searchInput: { type: Array, required: true },
    hasReset: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSearchLoading: {
      type: Boolean,
      require: true,
    },
    queryPath: {
      type: String,
      required: false,
      default: '',
    },
  });

  const { navigateTo, getQueryString } = useNavigate();

  const queryParams = computed(() => getQueryString());

  const selectedKey = ref(props.searchInput[0]?.key);

  const validationSchema = computed(() => {
    if (selectedKey.value === 'DONG_HO') {
      return toTypedSchema(
        z.object({
          keyword: z
            .string()
            .trim()
            .regex(
              /^[0-9A-Za-z]+-[0-9A-Za-z]+$/,
              '동-호수 형식으로 입력해주세요',
            )
            .transform((val) => val.toUpperCase()), // 제출 시 대문자 변환
        }),
      );
    }
    return toTypedSchema(
      z.object({
        keyword: z.string({ required_error: '' }).trim(),
      }),
    );
  });

  const { handleSubmit, defineField, resetForm, errors } = useForm({
    validationSchema,
  });

  const [keyword] = defineField('keyword');

  // keyword 입력 검색
  const onSubmit = handleSubmit((submitValues) => {
    const query = {
      ...queryParams.value,
      searchType: selectedKey.value,
      keyword: submitValues.keyword,
      page: 0,
    };

    if (!query.keyword) {
      delete query.keyword;
    }

    navigateTo({
      path: props.queryPath,
      query,
    });
  });

  // 초기화버튼 클릭
  const onReset = () => {
    resetForm();
    selectedKey.value = props.searchInput[0]?.key;
    navigateTo(props.queryPath);
  };

  // 검색 타입 변경 시 keyword 초기화
  watch(selectedKey, () => {
    keyword.value = '';
  });

  defineExpose({
    exposeOnReset: onReset,
  });
</script>

<template>
  <form
    id="form"
    class="flex justify-between"
    @submit="onSubmit"
    @reset="onReset"
  >
    <div class="flex flex-wrap gap-2">
      <!-- 검색 select, input -->
      <div class="flex gap-2">
        <select
          v-model="selectedKey"
          name="searchInput"
          class="z-10 flex h-10 cursor-pointer items-center rounded-md border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[position:right_0.75rem_center] bg-no-repeat px-4 pr-[38px] text-defaults-secondary-text-secondary pretendard-14Regular disabled:bg-gray-100"
          :disabled="disabled"
        >
          <option
            v-for="input in searchInput"
            :key="input?.key"
            :value="input?.key"
          >
            {{ input?.label }}
          </option>
        </select>
        <div class="h-16">
          <label class="relative flex h-10">
            <IconSearchLineBlack
              class="absolute left-3 top-1/2 translate-y-[-50%]"
            />
            <input
              v-model="keyword"
              type="text"
              :disabled="disabled"
              :placeholder="
                selectedKey === 'DONG_HO'
                  ? '예: 101-201, 101-201A'
                  : '검색어를 입력해주세요'
              "
              class="focus:border-brand-focus-border-focus w-64 whitespace-nowrap rounded-md border bg-defaults-primary-background-mono px-2.5 py-3 pl-10 pretendard-14Regular placeholder:text-defaults-secondary-text-secondary disabled:bg-gray-100"
            />
          </label>
          <p class="mt-1 text-sm text-alerts-error-text-error">
            {{ errors.keyword }}
          </p>
        </div>
      </div>
      <!-- slot for filters -->
      <slot />
    </div>
    <!-- 초기화, 검색 버튼 -->
    <div class="flex h-fit">
      <ButtonBase
        v-if="hasReset"
        form="form"
        type="reset"
        color="secondary"
        is-link
        class="flex items-center gap-2"
      >
        초기화
        <IconCloseDarkGray class="w-4" />
      </ButtonBase>
      <ButtonBase
        form="form"
        type="submit"
        color="primary"
        class="flex items-center gap-2"
        :disabled="isSearchLoading || disabled"
      >
        <SpinnerCircle v-if="isSearchLoading" />
        <div v-else class="w-full">검색</div>
      </ButtonBase>
    </div>
  </form>
</template>
