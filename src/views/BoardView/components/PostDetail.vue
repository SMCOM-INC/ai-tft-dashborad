<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import ModalImage from '@components/common/ModalImage.vue';
  import BoardMemberBlackListAddModal from '@views/BoardView/BlackList/BoardMemberBlackListAddModal.vue';
  import { computed, ref } from 'vue';

  import { BOARD_STATUS } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import findComplaintStatus from '@/lib/utils/findComplaintStatus.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  const props = defineProps({
    data: { type: Object, required: false, default: undefined },
    postType: {
      type: String,
      required: true,
      default: 'community',
      validator(value) {
        return ['complaint', 'community', 'report'].includes(value);
      },
    },
    reportedCount: { type: Number, required: false, default: 0 },
  });

  const { getCurrentRoutePath } = useNavigate();
  const isCommunityPage = computed(() => {
    return getCurrentRoutePath().includes('board/community');
  });

  const isImageModalOpenRef = ref(false);
  const selectedImageIndex = ref(0);

  const isAddBlackListModalRef = ref(false);

  // 등록 모달 닫기
  const closeAddBlackListModal = () => {
    isAddBlackListModalRef.value = false;
  };
  // 등록 모달 열기
  const openAddBlackListModal = () => {
    isAddBlackListModalRef.value = true;
  };

  const handleImageClick = (index) => {
    selectedImageIndex.value = index;
    isImageModalOpenRef.value = true;
  };

  const handleImageModalClose = () => {
    isImageModalOpenRef.value = false;
  };
</script>

<template>
  <section class="flex flex-col gap-5">
    <div class="flex flex-col gap-[10px]">
      <h3 class="text-base font-semibold text-muted-foreground-100">
        게시글 정보
      </h3>
      <div class="mb-5 max-h-[610px] w-full overflow-auto rounded-md border">
        <table class="w-full divide-y divide-dark-100 text-sm">
          <thead>
            <tr>
              <th
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                제목
              </th>
              <td class="px-6 py-3">
                {{ decodeUrl(props.data?.title) || '정보없음' }}
              </td>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-100 bg-white">
            <tr>
              <th
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                주제
              </th>
              <td class="px-6 py-4">
                <ChipBase color="blue-100" variant="outline" class="w-fit">
                  {{ props.data?.categoryName || '정보없음' }}
                </ChipBase>
              </td>
              <th
                v-if="postType === 'complaint'"
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                상태
              </th>
              <td v-if="postType === 'complaint'" class="px-6 py-4">
                <ChipBase
                  v-if="props.data?.status === 'visible'"
                  :key="`${props.data?.uuid}-visible`"
                  color="blue-10"
                  variant="fill"
                  class="w-14"
                  >{{ BOARD_STATUS[props.data?.status] }}</ChipBase
                >
                <ChipBase
                  v-else-if="props.data?.status === 'hidden'"
                  :key="`${props.data?.uuid}-hidden`"
                  color="gray-100"
                  variant="fill"
                  class="w-14"
                  >{{ BOARD_STATUS[props.data?.status] }}</ChipBase
                >
                <ChipBase
                  v-else-if="props.data?.status === 'RECEIVED'"
                  :key="`${props.data?.uuid}-received`"
                  color="blue-10"
                  variant="fill"
                  class="w-14"
                  >{{ findComplaintStatus(props.data?.status).label }}</ChipBase
                >
                <ChipBase
                  v-else-if="props.data?.status === 'IN_PROGRESS'"
                  :key="`${props.data?.uuid}-inProgress`"
                  color="blue-100"
                  variant="fill"
                  class="w-14"
                  >{{ findComplaintStatus(props.data?.status).label }}</ChipBase
                >
                <ChipBase
                  v-else-if="props.data?.status === 'COMPLETED'"
                  :key="`${props.data?.uuid}-completed`"
                  color="gray-100"
                  variant="fill"
                  class="w-14"
                  >{{ findComplaintStatus(props.data?.status).label }}</ChipBase
                >
                <span v-else>정보없음</span>
              </td>
              <th
                v-if="postType === 'report'"
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                누적 신고 수
              </th>
              <td v-if="postType === 'report'" class="px-6 py-4">
                <span class="text-destructive-100">
                  {{ reportedCount.toLocaleString('en-US') || '정보없음' }}
                </span>
              </td>
            </tr>
            <tr>
              <th
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                작성자
              </th>
              <td class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <span>{{
                    props.data?.authorText?.replaceAll(',', '') || '정보없음'
                  }}</span>
                  <button
                    v-if="
                      isCommunityPage &&
                      !props.data?.blackListFlag &&
                      props.data?.authorText !== '탈퇴한 회원'
                    "
                    type="button"
                    class="ml-2 rounded bg-primary-100 px-2 py-1 text-xs text-white hover:bg-primary-100/80"
                    @click="openAddBlackListModal"
                  >
                    블랙리스트 등록
                  </button>
                  <button
                    v-if="isCommunityPage && props.data?.blackListFlag"
                    type="button"
                    class="ml-2 cursor-not-allowed rounded bg-destructive-100 px-2 py-1 text-xs text-white"
                  >
                    블랙리스트
                  </button>
                </div>
              </td>
              <th
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                작성일
              </th>
              <td class="px-6 py-4">
                {{ formatDate(props.data?.createdDate).full() || '정보없음' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex flex-col gap-[10px]">
      <h3 class="text-base font-semibold text-muted-foreground-100">내용</h3>
      <div
        class="flex max-h-[610px] min-h-[337px] w-full flex-wrap content-between overflow-auto rounded-md border px-4 py-3"
      >
        <span
          v-dompurify-html="decodeUrlToParagraph(props.data?.content)"
          class="w-full text-base leading-7"
        />
        <template v-if="props.data?.fileList && props.data.fileList.length > 0">
          <ModalImage
            :images="props.data?.fileList"
            :is-open="isImageModalOpenRef"
            :image-index="selectedImageIndex"
            @close="handleImageModalClose"
          />
          <ul class="my-6 mb-4 flex gap-2">
            <li
              v-for="(image, index) in props.data?.fileList"
              :key="image?.fileUuid"
              class="flex justify-center"
            >
              <button type="button" @click="handleImageClick(index)">
                <img
                  class="border-gray-20 h-24 w-24 rounded-md border"
                  :src="getFullImageUrl(image?.fileUrl)"
                  :alt="`게시글 첨부 이미지`"
                />
              </button>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
  <BoardMemberBlackListAddModal
    v-if="isAddBlackListModalRef"
    :data="isCommunityPage ? props.data : null"
    @close="closeAddBlackListModal"
  />
</template>
