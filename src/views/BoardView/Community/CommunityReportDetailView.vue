<script setup>
  import BoardStatistics from '@components/common/BoardStatistics.vue';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import TableView from '@components/common/TableView.vue';
  import CommentList from '@views/BoardView/components/CommentList.vue';
  import PostDetail from '@views/BoardView/components/PostDetail.vue';
  import { computed, ref } from 'vue';

  import {
    BOARD_COMMUNITY_REPORTS_DETAIL_TABLE_COLUMNS_LIST,
    BOARD_EDITOR_CONTENT_TYPE,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteCommunityComment from '@/lib/queries/boardCommunity/useDeleteCommunityComment.js';
  import useDeleteCommunityPost from '@/lib/queries/boardCommunity/useDeleteCommunityPost.js';
  import useGetCommunityCommentList from '@/lib/queries/boardCommunity/useGetCommunityCommentList.js';
  import useGetCommunityDetail from '@/lib/queries/boardCommunity/useGetCommunityDetail.js';
  import useGetCommunityReportDetail from '@/lib/queries/boardCommunity/useGetCommunityReportDetail.js';
  import usePatchCommunityComment from '@/lib/queries/boardCommunity/usePatchCommunityComment.js';
  import usePostCommunityComment from '@/lib/queries/boardCommunity/usePostCommunityComment.js';
  import usePostCommunityCommentReply from '@/lib/queries/boardCommunity/usePostCommunityCommentReply.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import { boardCommentInputSchema } from '@/schemas/board.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { getParams } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const communityPostUuid = getParams().uuid;
  const deleteCommunityPostPostModalRef = ref(null);

  const {
    communityPostDetail,
    isCommunityPostDetailLoading,
    isError: isCommunityPostDetailError,
    error: communityPostDetailError,
  } = useGetCommunityDetail(userInfo.aptUuid, communityPostUuid);

  const {
    communityPostCommentList,
    isCommunityPostCommentListLoading,
    isError: isCommunityPostCommentListError,
    error: communityPostCommentListError,
  } = useGetCommunityCommentList(userInfo.aptUuid, communityPostUuid);

  const {
    communityReportDetailList,
    isCommunityReportDetailListLoading,
    isError: isCommunityReportDetailListError,
    error: communityReportDetailListError,
  } = useGetCommunityReportDetail(userInfo.aptUuid, communityPostUuid, {
    pageable: { page: 0, size: 10 },
    searchParams: {},
  });

  const { postCommunityCommentMutationAsync, isPostCommunityCommentPending } =
    usePostCommunityComment(userInfo.aptUuid, communityPostUuid);

  const {
    postCommunityCommentReplyMutationAsync,
    isPostCommunityCommentReplyPending,
  } = usePostCommunityCommentReply(userInfo.aptUuid, communityPostUuid);

  const { patchCommunityCommentMutationAsync, isPatchCommunityCommentPending } =
    usePatchCommunityComment(userInfo.aptUuid, communityPostUuid);

  const {
    deleteCommunityPostMutation,
    isDeleteCommunityPostPending,
    isDeleteCommunityPostError,
    deleteCommunityPostError,
  } = useDeleteCommunityPost();

  const {
    deleteCommunityCommentMutationAsync,
    isDeleteCommunityCommentPending,
  } = useDeleteCommunityComment(userInfo.aptUuid, communityPostUuid);

  const handlePostCommunityCommentAction = async (content) => {
    try {
      await boardCommentInputSchema.parseAsync(content);
      await postCommunityCommentMutationAsync(content);
    } catch (error) {
      if (error.errors) {
        swalErrorModal({
          text: error.errors[0].message,
        });
      }
    }
  };

  const handleEditCommunityCommentAction = async (contentData) => {
    try {
      await boardCommentInputSchema.parseAsync(contentData);
      await patchCommunityCommentMutationAsync({
        commentUuid: contentData.commentUuid,
        content: contentData.content,
        imageFileUuid: contentData.imageFileUuid,
      });
    } catch (error) {
      if (error.errors) {
        swalErrorModal({
          text: error.errors[0].message,
        });
      }
    }
  };

  const handlePostCommunityCommentReplyAction = async (data) => {
    try {
      await boardCommentInputSchema.parseAsync(data);
      await postCommunityCommentReplyMutationAsync({
        parentUuid: data.parentUuid,
        content: data.content,
        imageFileUuid: data.imageFileUuid,
      });
    } catch (error) {
      if (error.errors) {
        swalErrorModal({
          text: error.errors[0].message,
        });
      }
    }
  };

  const deleteCommunityPost = () => {
    deleteCommunityPostMutation({ communityUuidList: [communityPostUuid] });
  };

  const handleDeleteCommunityCommentAction = async (commentUuid) => {
    await deleteCommunityCommentMutationAsync(commentUuid);
  };

  const reportedCount = computed(() => {
    return communityReportDetailList.value?.totalElements || 0;
  });
</script>

<template>
  <div class="h-full w-full p-8">
    <ButtonBack />
    <PageTitleBase title="신고 게시글" />
    <div v-if="isCommunityPostDetailLoading">
      <SkeletonBar v-for="i in 4" :key="i" />
    </div>
    <section v-else class="flex flex-col gap-5">
      <div v-if="isCommunityPostDetailError">
        <span class="text-red-500"
          >게시글 정보를 불러오는 중 오류가 발생했습니다.
          {{ communityPostDetailError }}</span
        >
      </div>
      <PostDetail
        v-else
        post-type="report"
        :data="communityPostDetail"
        :reported-count="reportedCount"
      />
      <div class="flex items-start justify-between gap-2">
        <BoardStatistics
          :view-count="communityPostDetail?.viewCount"
          :like-count="communityPostDetail?.likeCount"
          like-button-name="추천수"
        />
        <div class="flex justify-end gap-2">
          <ModalParagraph
            v-if="!communityPostDetail?.blackListFlag"
            ref="deleteCommunityPostPostModalRef"
            trigger-button-name="게시글 삭제"
            title="게시글을 삭제하시겠습니까?"
            paragraph="삭제된 게시글은 복구할 수 없습니다."
            color="red"
            close-button-name="삭제"
            icon="trash"
            :is-loading="isDeleteCommunityPostPending"
            :is-error="isDeleteCommunityPostError"
            :error="deleteCommunityPostError"
            @confirm="deleteCommunityPost"
          />
        </div>
      </div>
      <CommentList
        :is-open="false"
        :comments="communityPostCommentList"
        :editable="true"
        :is-loading="isCommunityPostCommentListLoading"
        :is-error="isCommunityPostCommentListError"
        :error="communityPostCommentListError"
        :editor-domain="BOARD_EDITOR_CONTENT_TYPE.COMMUNITY"
        :query-states="{
          edit: {
            isPending: isPatchCommunityCommentPending,
          },
          delete: {
            isPending: isDeleteCommunityCommentPending,
          },
          reply: {
            isPending: isPostCommunityCommentReplyPending,
          },
          new: {
            isPending: isPostCommunityCommentPending,
          },
        }"
        @submit="(content) => handlePostCommunityCommentAction(content)"
        @edit="(data) => handleEditCommunityCommentAction(data)"
        @reply="(data) => handlePostCommunityCommentReplyAction(data)"
        @delete="(uuid) => handleDeleteCommunityCommentAction(uuid)"
      />
      <div class="-mt-8 mb-16 flex flex-col gap-[10px]">
        <h3 class="text-base font-semibold text-muted-foreground-100">
          신고 정보 ({{ reportedCount }}건)
        </h3>
        <TableView
          show-count
          :column-data="BOARD_COMMUNITY_REPORTS_DETAIL_TABLE_COLUMNS_LIST"
          :page-data="communityReportDetailList"
          :is-loading="isCommunityReportDetailListLoading"
          :is-error="isCommunityReportDetailListError"
          :error="communityReportDetailListError"
        />
      </div>
    </section>
  </div>
</template>
