<script setup>
  import ChipBase from '@components/common/ChipBase.vue';

  import { APT_DETAILS_BASIC_INFO_LIST } from '@/constants/apt.js';
  import useGetAptDetail from '@/lib/queries/apt/useGetAptDetail.js';
  import useGetMasterAptDetail from '@/lib/queries/apt/useGetMasterAptDetail.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const { aptDetail, isAptDetailLoading } =
    token.userRole === 'master'
      ? useGetMasterAptDetail(userInfo.aptUuid)
      : useGetAptDetail();
</script>

<template>
  <template v-if="!isAptDetailLoading">
    <ul class="mb-10 flex flex-col gap-6 text-sm font-normal leading-[14px]">
      <li
        v-for="info in APT_DETAILS_BASIC_INFO_LIST"
        :key="info.key"
        class="flex gap-3"
      >
        <span class="min-w-[100px] font-semibold">{{ info.label }}</span>
        <span v-if="info.key === 'aptTel'">
          {{ formatContact(aptDetail?.aptTel) || '정보없음' }}
        </span>
        <span v-else-if="info.type === 'number'">
          {{
            aptDetail?.[info.key]
              ? parseInt(aptDetail[info.key]).toLocaleString()
              : '정보없음'
          }}
        </span>
        <template v-else-if="info.type === 'contentList'">
          <div
            class="flex h-full select-none items-center gap-1 whitespace-nowrap"
          >
            <ChipBase
              v-for="content in aptDetail?.contentList"
              :key="content?.uuid"
              color="gray-20"
              variant="fill"
            >
              {{ content?.name }}
            </ChipBase>
          </div>
        </template>
        <span v-else> {{ aptDetail ? aptDetail[info.key] : '정보없음' }} </span>
      </li>
    </ul>
    <p class="text-xs leading-7 text-muted-foreground-100">
      기본정보 수정은 아파트먼트로 문의주세요.
    </p>
  </template>
</template>
