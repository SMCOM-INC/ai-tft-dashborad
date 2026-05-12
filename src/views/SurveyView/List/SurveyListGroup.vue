<script setup>
  import SurveyListGroupHeader from '@views/SurveyView/List/SurveyListGroupHeader.vue';
  import SurveyListGroupItem from '@views/SurveyView/List/SurveyListGroupItem.vue';

  const props = defineProps({
    groupInfo: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  });

  const emits = defineEmits(['edit', 'toggle']);

  const editGroup = () => {
    emits('edit', props.groupInfo);
  };

  const toggleGroup = () => {
    emits('toggle');
  };
</script>

<template>
  <li>
    <SurveyListGroupHeader
      :group-info="groupInfo"
      :is-open="isOpen"
      @edit="editGroup"
      @toggle="toggleGroup"
    />
    <div
      :class="`rounded-bl-md rounded-br-md border transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'h-[0px] overflow-hidden opacity-0'
      }`"
    >
      <template v-if="groupInfo?.surveyList?.length > 0">
        <ul v-for="(survey, index) in groupInfo?.surveyList" :key="survey.uuid">
          <SurveyListGroupItem
            :item-info="survey"
            :group-uuid="groupInfo.uuid"
            :class="`${
              index === groupInfo?.surveyList?.length - 1
                ? undefined
                : 'border-b border-b-defaults-secondary-border-secondary'
            }`"
          />
        </ul>
      </template>
      <p
        v-else
        class="w-full border-defaults-secondary-border-secondary py-12 text-center text-defaults-tertiary-text-tertiary pretendard-16Medium"
      >
        그룹에 추가된 하위 내용이 없습니다.
      </p>
    </div>
  </li>
</template>
