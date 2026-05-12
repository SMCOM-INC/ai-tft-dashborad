import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteComplaintPost } from '@/apis/boardComplaints.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteComplaintPost = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteComplaintPostMutation,
    isPending: isDeleteComplaintPostPending,
    isError: isDeleteComplaintPostError,
    error: deleteComplaintPostError,
  } = useMutation({
    mutationFn: async ({ complaintUuidList }) => {
      await Promise.all(
        complaintUuidList.map((complaintUuid) =>
          deleteComplaintPost({ aptUuid, complaintUuid }),
        ),
      );
    },
    onSuccess: () => {
      swalSuccessModal({
        text: '민원 글이 삭제되었습니다.',
      });

      queryClient.invalidateQueries({
        queryKey: ['complaintPostList', aptUuid],
      });

      if (getCurrentRoutePath().includes('detail')) {
        navigateTo('/board/complaints');
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    deleteComplaintPostMutation,
    isDeleteComplaintPostPending,
    isDeleteComplaintPostError,
    deleteComplaintPostError,
  };
};

export default useDeleteComplaintPost;
