import useDeleteVoteQuestion from '@/lib/queries/vote/useDeleteVoteQuestion.js';
import usePatchVoteQuestion from '@/lib/queries/vote/usePatchVoteQuestion.js';
import usePostVoteQuestion from '@/lib/queries/vote/usePostVoteQuestion.js';

const useVoteQuestionActions = () => {
  const { postVoteQuestionMutationAsync } = usePostVoteQuestion();
  const { patchVoteQuestionMutationAsync } = usePatchVoteQuestion();
  const { deleteVoteQuestionMutationAsync } = useDeleteVoteQuestion();

  // 질문 저장
  const saveQuestion = async ({ questionData }) => {
    await postVoteQuestionMutationAsync({ questionData });
  };
  // 질문 수정
  const editQuestion = async ({ questionData }) => {
    await patchVoteQuestionMutationAsync({ questionData });
  };

  // 질문 삭제
  const deleteQuestion = async ({ questionUuid }) => {
    await deleteVoteQuestionMutationAsync({ questionUuid });
  };

  return { saveQuestion, editQuestion, deleteQuestion };
};

export default useVoteQuestionActions;
