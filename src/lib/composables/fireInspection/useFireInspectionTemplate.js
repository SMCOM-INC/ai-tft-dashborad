import { useForm } from 'vee-validate';
import { ref } from 'vue';

import { FIRE_INSPECTION_QUESTION_TEMPLATE } from '@/constants/fireInspection.js';
import { fireInspectionTableRegisterInfoFormSchema } from '@/schemas/fireInspection.js';

export const useFireInspectionTemplate = () => {
  // 폼
  const { meta, handleSubmit, defineField, setValues } = useForm({
    validationSchema: fireInspectionTableRegisterInfoFormSchema,
  });

  const [submissionType] = defineField('submissionType');
  const [inspector] = defineField('inspector');
  const [inspectorPhone] = defineField('inspectorPhone');
  const [submissionDateTime] = defineField('submissionDateTime');
  const [inspectionQuestions] = defineField('inspectionQuestions');

  // Validation 에러
  const isValidationErrorModalOpen = ref(false);
  const validationErrors = ref({});

  const handleValidationError = (submitErrors) => {
    if (Object.keys(submitErrors).length > 0) {
      validationErrors.value = submitErrors;
      isValidationErrorModalOpen.value = true;
    }
  };

  const closeValidationErrorModal = () => {
    isValidationErrorModalOpen.value = false;
    validationErrors.value = {};
  };

  const convertQuestionAnswerList = (answers) => {
    return FIRE_INSPECTION_QUESTION_TEMPLATE.sections.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.questions.map((question) => ({
          sectionId: section.sectionId,
          groupId: group.groupId,
          questionId: question.questionId,
          answer: answers[question.questionId],
        })),
      ),
    );
  };

  return {
    // Form fields
    submissionType,
    inspector,
    inspectorPhone,
    submissionDateTime,
    inspectionQuestions,
    meta,

    // Validation state
    validationErrors,
    isValidationErrorModalOpen,

    // Actions
    handleSubmit,
    setValues,
    handleValidationError,
    closeValidationErrorModal,
    convertQuestionAnswerList,
  };
};
