<script setup>
  import BoardStatistics from '@components/common/BoardStatistics.vue';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import CommentList from '@views/BoardView/components/CommentList.vue';
  import PostDetail from '@views/BoardView/components/PostDetail.vue';
  import { ref } from 'vue';

  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteComplaintComment from '@/lib/queries/boardComplaints/useDeleteComplaintComment.js';
  import useDeleteComplaintPost from '@/lib/queries/boardComplaints/useDeleteComplaintPost.js';
  import useGetComplaintCommentList from '@/lib/queries/boardComplaints/useGetComplaintCommentList.js';
  import useGetComplaintDetail from '@/lib/queries/boardComplaints/useGetComplaintDetail.js';
  import usePatchComplaintComment from '@/lib/queries/boardComplaints/usePatchComplaintComment.js';
  import usePatchComplaintState from '@/lib/queries/boardComplaints/usePatchComplaintState.js';
  import usePostComplaintComment from '@/lib/queries/boardComplaints/usePostComplaintComment.js';
  import usePostComplaintCommentReply from '@/lib/queries/boardComplaints/usePostComplaintCommentReply.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import { boardCommentInputSchema } from '@/schemas/board.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { getParams } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const complaintUuid = getParams().uuid;
  const changeToReceivedModalRef = ref(null);
  const changeToInProgressModalRef = ref(null);
  const changeToCompletedModalRef = ref(null);
  const deleteComplaintPostModalRef = ref(null);

  const {
    complaintPostDetail,
    isComplaintPostDetailLoading,
    isError: isComplaintPostDetailError,
    error: complaintPostDetailError,
  } = useGetComplaintDetail(userInfo.aptUuid, complaintUuid);

  const {
    complaintPostCommentList,
    isComplaintPostCommentListLoading,
    isError: isComplaintPostCommentListError,
    error: complaintPostCommentListError,
  } = useGetComplaintCommentList(userInfo.aptUuid, complaintUuid);

  const {
    receivedMutation,
    inProgressMutation,
    completedMutation,
    isReceivedLoading,
    isInProgressLoading,
    isCompletedLoading,
    isReceivedError,
    isInProgressError,
    isCompletedError,
    receivedError,
    inProgressError,
    completedError,
  } = usePatchComplaintState(userInfo.aptUuid);

  const {
    postComplaintPostCommentMutation,
    isPostComplaintPostCommentPending,
    isError: isPostComplaintPostCommentMutationError,
    error: postComplaintPostCommentMutationError,
  } = usePostComplaintComment(userInfo.aptUuid, complaintUuid);

  const {
    postComplaintPostCommentReplyMutation,
    isPostComplaintPostCommentReplyPending,
    isError: isPostComplaintPostCommentReplyMutationError,
    error: postComplaintPostCommentReplyMutationError,
  } = usePostComplaintCommentReply(userInfo.aptUuid, complaintUuid);

  const {
    patchComplaintPostCommentMutation,
    isPatchComplaintPostCommentPending,
    isError: isPatchComplaintPostCommentMutationError,
    error: patchComplaintPostCommentMutationError,
  } = usePatchComplaintComment(userInfo.aptUuid, complaintUuid);

  const {
    deleteComplaintPostMutation,
    isDeleteComplaintPostPending,
    isDeleteComplaintPostError,
    deleteComplaintPostError,
  } = useDeleteComplaintPost();

  const {
    deleteComplaintPostPostCommentMutation,
    isdeleteComplaintPostPostCommentPending,
    isError: isdeleteComplaintPostPostCommentMutationError,
    error: deleteComplaintPostPostCommentMutationError,
  } = useDeleteComplaintComment(userInfo.aptUuid, complaintUuid);

  // 민원 상태 변경 핸들러
  const handleChangeComplaintStatusAction = async (status) => {
    const mutationMap = {
      RECEIVED: receivedMutation,
      IN_PROGRESS: inProgressMutation,
      COMPLETED: completedMutation,
    };

    await mutationMap[status]({
      complaintUuid,
      status,
    });
  };

  const handlePostComplaintPostCommentAction = async (content) => {
    try {
      await boardCommentInputSchema.parseAsync(content);
      await postComplaintPostCommentMutation(content);
    } catch (error) {
      if (error.errors) {
        swalErrorModal({
          text: error.errors[0].message,
        });
      }
    }
  };

  const handleEditComplaintPostCommentAction = async (contentData) => {
    try {
      await boardCommentInputSchema.parseAsync(contentData);
      await patchComplaintPostCommentMutation({
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

  const handlePostComplaintPostCommentReplyAction = async (data) => {
    try {
      await boardCommentInputSchema.parseAsync(data);
      await postComplaintPostCommentReplyMutation({
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

  const deleteComplaints = () => {
    deleteComplaintPostMutation({ complaintUuidList: [complaintUuid] });
  };

  const handleDeleteComplaintPostPostCommentAction = async (commentUuid) => {
    await deleteComplaintPostPostCommentMutation(commentUuid);
  };
</script>

<template>
  <div class="h-full w-full p-8">
    <ButtonBack />
    <PageTitleBase title="민원공간 상세" />
    <div v-if="isComplaintPostDetailLoading">
      <SkeletonBar v-for="i in 4" :key="i" />
    </div>
    <section v-else class="flex flex-col gap-5">
      <div v-if="isComplaintPostDetailError">
        <span class="text-red-500"
          >민원 정보를 불러오는 중 오류가 발생했습니다.
          {{ complaintPostDetailError }}</span
        >
      </div>
      <PostDetail v-else post-type="complaint" :data="complaintPostDetail" />
      <div class="flex items-start justify-between gap-2">
        <BoardStatistics
          :view-count="complaintPostDetail?.viewCount"
          :like-count="complaintPostDetail?.likeCount"
          like-button-name="공감수"
        />
        <div class="flex justify-end gap-2">
          <div class="flex gap-2">
            <ModalParagraph
              v-if="complaintPostDetail?.status === 'RECEIVED'"
              ref="changeToInProgressModalRef"
              trigger-button-name="처리중으로 상태 수정"
              title="처리중으로 변경하기"
              paragraph="민원상태를 [처리중]으로 변경하시겠어요?"
              color="deepBlue"
              close-button-name="변경"
              :is-error="isInProgressError"
              :error="inProgressError"
              :is-loading="isInProgressLoading"
              @confirm="handleChangeComplaintStatusAction('IN_PROGRESS')"
            />
            <div
              v-if="complaintPostDetail?.status === 'IN_PROGRESS'"
              class="flex gap-2"
            >
              <ModalParagraph
                ref="changeToReceivedModalRef"
                trigger-button-name="접수중으로 되돌리기"
                title="접수중으로 되돌리기"
                paragraph="민원상태를 [접수중]으로 변경하시겠어요?"
                color="lightGray"
                close-button-name="변경"
                :is-error="isReceivedError"
                :error="receivedError"
                :is-loading="isReceivedLoading"
                @confirm="handleChangeComplaintStatusAction('RECEIVED')"
              />

              <ModalParagraph
                ref="changeToCompletedModalRef"
                trigger-button-name="처리완료로 상태 수정"
                title="처리완료로 변경하기"
                paragraph="민원상태를 [처리완료]으로 변경하시겠어요?"
                color="deepBlue"
                close-button-name="변경"
                :is-error="isCompletedError"
                :error="completedError"
                :is-loading="isCompletedLoading"
                @confirm="handleChangeComplaintStatusAction('COMPLETED')"
              />
            </div>
            <ModalParagraph
              v-if="complaintPostDetail?.status === 'COMPLETED'"
              ref="changeToInProgressModalRef"
              trigger-button-name="처리중으로 상태 수정"
              title="처리중으로 변경하기"
              paragraph="민원상태를 [처리중]으로 변경하시겠어요?"
              color="deepBlue"
              close-button-name="변경"
              :is-error="isInProgressError"
              :error="inProgressError"
              :is-loading="isInProgressLoading"
              @confirm="handleChangeComplaintStatusAction('IN_PROGRESS')"
            />
          </div>
          <ModalParagraph
            ref="deleteComplaintPostModalRef"
            trigger-button-name="민원 삭제"
            title="선택한 민원을 삭제 하시겠습니까?"
            paragraph="삭제 이후에는 복구할 수 없습니다."
            color="red"
            close-button-name="삭제 처리"
            :is-loading="isDeleteComplaintPostPending"
            :is-error="isDeleteComplaintPostError"
            :error="deleteComplaintPostError"
            @confirm="deleteComplaints"
          />
        </div>
      </div>
      <CommentList
        :comments="complaintPostCommentList"
        :editable="true"
        :is-loading="isComplaintPostCommentListLoading"
        :is-error="isComplaintPostCommentListError"
        :error="complaintPostCommentListError"
        :editor-domain="BOARD_EDITOR_CONTENT_TYPE.COMPLAINT"
        :query-states="{
          edit: {
            isError: isPatchComplaintPostCommentMutationError,
            error: patchComplaintPostCommentMutationError,
            isPending: isPatchComplaintPostCommentPending,
          },
          delete: {
            isError: isdeleteComplaintPostPostCommentMutationError,
            error: deleteComplaintPostPostCommentMutationError,
            isPending: isdeleteComplaintPostPostCommentPending,
          },
          reply: {
            isError: isPostComplaintPostCommentReplyMutationError,
            error: postComplaintPostCommentReplyMutationError,
            isPending: isPostComplaintPostCommentReplyPending,
          },
          new: {
            isError: isPostComplaintPostCommentMutationError,
            error: postComplaintPostCommentMutationError,
            isPending: isPostComplaintPostCommentPending,
          },
        }"
        @submit="(content) => handlePostComplaintPostCommentAction(content)"
        @edit="(data) => handleEditComplaintPostCommentAction(data)"
        @reply="(data) => handlePostComplaintPostCommentReplyAction(data)"
        @delete="(uuid) => handleDeleteComplaintPostPostCommentAction(uuid)"
      />
    </section>
  </div>
</template>
