<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TableView from '@components/common/TableView.vue';
  import SurveyMessageButton from '@views/SurveyView/Message/SurveyMessageButton.vue';

  import {
    DETAIL_PARTICIPANT_SEARCH_INPUT_LIST,
    DETAIL_PARTICIPANT_TABLE_COLUMNS_LIST,
    PARTICIPANT_STATE,
    PARTICIPANT_STATE_LABEL,
    PARTICIPANTS_FILTER_STATE,
  } from '@/constants/survey.js';
  import useGetSurveyDetailDefault from '@/lib/queries/survey/useGetSurveyDetailDefault.js';
  import useGetSurveyDetailParticipants from '@/lib/queries/survey/useGetSurveyDetailParticipants.js';
  import useGetSurveyDetailParticipantsExcel from '@/lib/queries/survey/useGetSurveyDetailParticipantsExcel.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatContact from '@/lib/utils/formatContact.js';

  const { surveyDetailParticipants, isSurveyDetailParticipantsLoading } =
    useGetSurveyDetailParticipants();

  const { surveyDetailDefault, isSurveyDetailDefaultLoading } =
    useGetSurveyDetailDefault();

  const {
    isSurveyDetailParticipantsExcelLoading,
    refetchSurveyDetailParticipantsExcel,
  } = useGetSurveyDetailParticipantsExcel();

  const findParticipantsStateStyle = (state) => {
    switch (state) {
      case PARTICIPANT_STATE.PARTICIPATED:
        return 'bg-alerts-success-background-success';
      case PARTICIPANT_STATE.PENDING:
        return 'bg-alerts-warning-background-warning';
      case PARTICIPANT_STATE.NOT_PARTICIPATED:
        return 'bg-defaults-tertiary-background-tertiary';
      default:
        break;
    }
  };
</script>

<template>
  <SearchBar
    :search-input="DETAIL_PARTICIPANT_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isSurveyDetailParticipantsLoading"
  >
    <FilterCheckboxGroup :filter="PARTICIPANTS_FILTER_STATE" />
  </SearchBar>
  <div class="flex w-full justify-end gap-2">
    <SpinnerCircle v-if="isSurveyDetailDefaultLoading" />
    <template v-else>
      <SurveyMessageButton :item-info="surveyDetailDefault" />
      <ButtonExcelDown
        :download-fn="refetchSurveyDetailParticipantsExcel"
        :is-loading="isSurveyDetailParticipantsExcelLoading"
        :disabled="surveyDetailParticipants?.content?.length <= 0"
      />
    </template>
  </div>
  <TableView
    :column-data="DETAIL_PARTICIPANT_TABLE_COLUMNS_LIST"
    :page-data="surveyDetailParticipants"
    pageable
    show-count
  >
    <template #default="{ row, column }">
      <template v-if="isSurveyDetailParticipantsLoading">
        <SkeletonBase class="h-5 rounded-md" />
      </template>
      <template v-else>
        <div v-if="column.key === 'state'" class="flex items-center gap-4">
          <span
            :class="`h-3 w-3 rounded-xl ${findParticipantsStateStyle(row[column.key])}`"
          />
          <span>{{ PARTICIPANT_STATE_LABEL[row[column.key]] }}</span>
        </div>
        <div v-else-if="column.key === 'phone'">
          {{ formatContact(decodeUrl(row[column.key])) }}
        </div>
        <div v-else>{{ decodeUrl(row[column.key]) }}</div>
      </template>
    </template>
  </TableView>
</template>
