import useDeleteSurveyQuestion from '@/lib/queries/survey/useDeleteSurveyQuestion.js';
import usePatchSurveyQuestion from '@/lib/queries/survey/usePatchSurveyQuestion.js';
import usePostSurveyQuestion from '@/lib/queries/survey/usePostSurveyQuestion.js';

const useSurveyQuestionActions = () => {
  const { postSurveyQuestionMutationAsync } = usePostSurveyQuestion();
  const { patchSurveyQuestionMutationAsync } = usePatchSurveyQuestion();
  const { deleteSurveyQuestionMutationAsync } = useDeleteSurveyQuestion();

  // 질문 저장
  const saveQuestion = async ({ questionData }) => {
    await postSurveyQuestionMutationAsync({ questionData });
  };
  // 질문 수정
  const editQuestion = async ({ questionData }) => {
    await patchSurveyQuestionMutationAsync({ questionData });
  };

  // 질문 삭제
  const deleteQuestion = async ({ questionUuid }) => {
    await deleteSurveyQuestionMutationAsync({ questionUuid });
  };

  return { saveQuestion, editQuestion, deleteQuestion };
};

export default useSurveyQuestionActions;
