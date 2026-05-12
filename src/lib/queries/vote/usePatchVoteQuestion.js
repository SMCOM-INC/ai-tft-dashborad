import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchVoteQuestion } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 수정
const usePatchVoteQuestion = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams, navigateTo } = useNavigate();

  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: patchVoteQuestionMutationAsync,
    isPending: isPatchVoteQuestionPending,
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

      return patchVoteQuestion({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        questionUuid: questionData.id,
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
        case 'NOT_FOUND_VOTE':
          swalErrorModal({ text: message });
          navigateTo('/vote/list');
          break;
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { patchVoteQuestionMutationAsync, isPatchVoteQuestionPending };
};

export default usePatchVoteQuestion;
