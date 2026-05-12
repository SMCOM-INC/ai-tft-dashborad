<script setup>
  import IconChevronsUpDown from '@assets/icons/icon-chevrons-up-down.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { useField } from 'vee-validate';

  import useGetGlobalNoticeCategories from '@/lib/queries/boardGlobalNotice/useGetGlobalNoticeCategories.js';

  defineProps({
    errors: {
      type: Object,
      required: true,
    },
  });

  // 카테고리 목록 조회
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetGlobalNoticeCategories();

  // 폼 필드들
  const { value: categoryUuid } = useField('categoryUuid');
  const { value: title } = useField('title');
  const { value: apartmantNoticeType } = useField('apartmantNoticeType');
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- 카테고리 선택 (새로 추가) -->
    <div>
      <LabelBase
        label-for="categoryUuid"
        label-text="공지사항 카테고리"
        class="gap-4"
        asterisk
      >
        <div v-if="isCategoriesLoading" class="text-muted-foreground-80">
          카테고리 목록을 불러오는 중...
        </div>
        <div
          v-else-if="categories && categories.length > 0"
          class="relative w-full max-w-xs"
        >
          <select
            v-model="categoryUuid"
            class="w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10"
          >
            <option value="">카테고리를 선택하세요</option>
            <option
              v-for="category in categories"
              :key="category.uuid"
              :value="category.uuid"
            >
              {{ category.name }}
            </option>
          </select>
          <!-- 아이콘 추가 -->
          <IconChevronsUpDown
            class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground-80"
          />
        </div>
      </LabelBase>
      <TextError v-if="errors.categoryUuid">
        {{ errors.categoryUuid }}
      </TextError>
    </div>

    <!-- Notice Type -->
    <div>
      <LabelBase
        label-for="apartmantNoticeType"
        label-text="공지 타입"
        class="gap-4"
        asterisk
      >
        <ul class="flex gap-3 xl:max-w-[1024px]">
          <li class="flex gap-2 rounded-md border p-3">
            <input
              id="resident-all"
              v-model="apartmantNoticeType"
              name="apartmantNoticeType"
              type="radio"
              value="RESIDENT_ALL_NOTICE"
            />
            <LabelBase label-for="resident-all" label-text="입주민 전체 공지" />
          </li>
          <li class="flex gap-2 rounded-md border p-3">
            <input
              id="resident-individual"
              v-model="apartmantNoticeType"
              name="apartmantNoticeType"
              type="radio"
              value="RESIDENT_INDIVIDUAL_NOTICE"
            />
            <LabelBase
              label-for="resident-individual"
              label-text="입주민 개별 공지"
            />
          </li>
          <li class="flex gap-2 rounded-md border p-3">
            <input
              id="admin-all"
              v-model="apartmantNoticeType"
              name="apartmantNoticeType"
              type="radio"
              value="APT_ADMIN_ALL_NOTICE"
            />
            <LabelBase
              label-for="admin-all"
              label-text="관리자 전체 공지"
              title="상단 고정"
            />
          </li>
          <li class="flex gap-2 rounded-md border p-3">
            <input
              id="admin-individual"
              v-model="apartmantNoticeType"
              name="apartmantNoticeType"
              type="radio"
              value="APT_ADMIN_INDIVIDUAL_NOTICE"
            />
            <LabelBase
              label-for="admin-individual"
              label-text="관리자 개별 공지"
              title="상단 고정"
            />
          </li>
        </ul>
      </LabelBase>
      <TextError v-if="errors.apartmantNoticeType">{{
        errors.apartmantNoticeType
      }}</TextError>
    </div>

    <!-- Title -->
    <div>
      <LabelBase
        label-for="title"
        label-text="공지사항 제목"
        asterisk
        class="gap-4"
      >
        <input
          id="title"
          v-model="title"
          type="text"
          name="title"
          placeholder="제목을 입력해주세요."
          class="w-full rounded-md border px-3 py-2 xl:max-w-[1024px]"
        />
      </LabelBase>
      <TextError v-if="errors.title">{{ errors.title }}</TextError>
    </div>
  </div>
</template>
