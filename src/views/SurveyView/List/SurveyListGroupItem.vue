<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SurveyListGroupItemKebabButton from '@views/SurveyView/List/SurveyListGroupItemKebabButton.vue';
  import SurveyMessageButton from '@views/SurveyView/Message/SurveyMessageButton.vue';
  import SurveyStateChip from '@views/SurveyView/SurveyStateChip.vue';

  import { SURVEY_STATE } from '@/constants/survey.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    itemInfo: {
      type: Object,
      required: true,
    },
    groupUuid: {
      type: String,
      required: true,
    },
  });

  const { navigateTo } = useNavigate();

  const moveDetail = () => {
    navigateTo(`/survey/detail/${props.groupUuid}/${props.itemInfo.uuid}`);
  };

  const moveToCreationForm = () => {
    navigateTo(`/survey/create/${props.groupUuid}/${props.itemInfo.uuid}`);
  };
</script>

<template>
  <li class="cursor-pointer hover:bg-slate-50">
    <!-- 완성 설문 -->
    <div
      v-if="itemInfo.finishFlag"
      class="flex w-full justify-between pretendard-16Regular"
      type="button"
      @click="moveDetail"
    >
      <div class="flex items-center gap-8 p-4">
        <SurveyStateChip :state="itemInfo.state" class="h-fit w-16" />
        <span class="text-left">{{ decodeUrl(itemInfo.title) }}</span>
      </div>
      <div class="flex items-center justify-between gap-4 p-4">
        <!-- 설문 시작전, 설문 진행중일 때만 -->
        <SurveyMessageButton
          v-if="itemInfo.status !== SURVEY_STATE.CLOSE"
          :item-info="itemInfo"
        />
        <span class="min-w-52">{{
          `${itemInfo.startDateTime?.slice(0, 10)} ~ ${itemInfo.endDateTime?.slice(0, 10)}`
        }}</span>
        <div class="w-10">
          <SurveyListGroupItemKebabButton
            v-if="itemInfo.state !== SURVEY_STATE.PROGRESS"
            :item-info="itemInfo"
          />
        </div>
      </div>
    </div>
    <!-- 미완성 설문 -->
    <div
      v-else
      class="flex w-full justify-between pretendard-16Regular"
      type="button"
      @click="moveToCreationForm"
    >
      <div class="flex items-center gap-8 p-4">
        <span
          class="w-16 px-1 text-center text-alerts-error-text-error pretendard-16Medium"
          >미완성</span
        >
        <span class="text-left">{{ decodeUrl(itemInfo.title) }}</span>
      </div>
      <div class="flex items-center justify-between gap-4 p-4">
        <ButtonBase
          type="button"
          size="md"
          class="flex items-center justify-center gap-2"
          color="primary"
          @click.stop="moveToCreationForm"
        >
          완성하러 가기
        </ButtonBase>
        <SurveyListGroupItemKebabButton :item-info="itemInfo" />
      </div>
    </div>
  </li>
</template>
