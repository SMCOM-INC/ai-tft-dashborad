<script setup>
  import InspectionTemplateCell from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateCell.vue';
  import InspectionTemplateRadioGroup from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateRadioGroup.vue';
  import { useField } from 'vee-validate';
  import { computed } from 'vue';

  import {
    FIRE_INSPECTION_QUESTION_TEMPLATE,
    FIRE_INSPECTION_RESULT_OPTIONS,
  } from '@/constants/fireInspection.js';

  defineProps({
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const { value: inspectionQuestions } = useField('inspectionQuestions');

  const inspectionSections = computed(() => {
    return FIRE_INSPECTION_QUESTION_TEMPLATE.sections;
  });

  const calculateRowSpan = (groups) => {
    return groups.reduce((total, group) => total + group.questions.length, 0);
  };

  const calculateGroupRowSpan = (questions) => {
    return questions.length;
  };

  // 점검 결과 변경 핸들러
  const handleResultChange = ({ questionId, resultKey }) => {
    inspectionQuestions.value = {
      ...inspectionQuestions.value,
      [questionId]: resultKey,
    };
  };
</script>

<template>
  <div
    class="rounded-md border border-b-0 border-defaults-primary-border-primary"
  >
    <table class="w-full">
      <thead>
        <tr>
          <th
            rowspan="2"
            colspan="3"
            class="border-b border-r border-defaults-primary-border-primary bg-defaults-secondary-background-secondary px-4 py-1.5 text-center pretendard-14SemiBold"
          >
            점검항목
          </th>
          <th
            class="border-b border-l border-defaults-primary-border-primary bg-defaults-secondary-background-secondary px-4 py-1.5 text-center pretendard-14SemiBold"
          >
            점검결과
          </th>
        </tr>
        <tr>
          <th
            class="border-b border-l border-defaults-primary-border-primary bg-defaults-secondary-background-secondary"
          >
            <div class="flex">
              <div
                v-for="option in FIRE_INSPECTION_RESULT_OPTIONS"
                :key="option.key"
                class="flex-1 border-r border-defaults-primary-border-primary px-4 py-1.5 text-center pretendard-14SemiBold last:border-r-0"
              >
                {{ option.label }}
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <template
          v-for="section in inspectionSections"
          :key="section.sectionId"
        >
          <template
            v-for="(group, groupIndex) in section.groups"
            :key="group.groupId"
          >
            <tr
              v-for="(question, questionIndex) in group.questions"
              :key="question.questionId"
            >
              <!-- Section Title (첫 번째 그룹의 첫 번째 질문에만 표시) -->
              <InspectionTemplateCell
                v-if="groupIndex === 0 && questionIndex === 0"
                :content="section.title"
                :row-span="calculateRowSpan(section.groups)"
              />

              <!-- Group Title (각 그룹의 첫 번째 질문에만 표시) -->
              <InspectionTemplateCell
                v-if="questionIndex === 0"
                :content="group.title"
                :row-span="calculateGroupRowSpan(group.questions)"
              />

              <!-- Question Label -->
              <InspectionTemplateCell :content="question.label" />

              <!-- Checkbox Group -->
              <td
                class="w-72 border-b border-defaults-primary-border-primary bg-defaults-primary-background-primary"
              >
                <InspectionTemplateRadioGroup
                  :model-value="inspectionQuestions?.[question.questionId]"
                  :options="FIRE_INSPECTION_RESULT_OPTIONS"
                  :name="`question-${question.questionId}`"
                  :disabled="disabled"
                  @update:model-value="
                    (value) =>
                      handleResultChange({
                        questionId: question.questionId,
                        resultKey: value,
                      })
                  "
                />
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
