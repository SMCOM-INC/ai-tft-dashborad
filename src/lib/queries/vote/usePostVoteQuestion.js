import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postVoteQuestion } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 등록
const usePostVoteQuestion = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams } = useNavigate();

  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: postVoteQuestionMutationAsync,
    isPending: isPostVoteQuestionPending,
  } = useMutation({
    mutationFn: ({ questionData }) => {
      const { options, content, minChoice, maxChoice, questionType } =
        questionData;

      const convertedOptionList = options.map((option, optionIndex) => {
        return {
          orderNum: optionIndex,
          content: option.content,
          fileList: option.fileList.map((file, fileIndex) => {
            return { uuid: file.uuid, orderNum: fileIndex };
          }),
        };
      });

      return postVoteQuestion({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        questionOptionList: convertedOptionList,
        content,
        questionType,
        minChoice,
        maxChoice,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteFormDetail']);
      clearActiveQuestion();
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { postVoteQuestionMutationAsync, isPostVoteQuestionPending };
};

export default usePostVoteQuestion;
