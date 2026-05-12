<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TableView from '@components/common/TableView.vue';
  import VoteDetailVotersSignModal from '@views/VoteView/Detail/VoteDetailVotersSignModal.vue';
  import VoteMessageButton from '@views/VoteView/Message/VoteMessageButton.vue';
  import { ref } from 'vue';

  import {
    DETAIL_VOTERS_SEARCH_INPUT_LIST,
    DETAIL_VOTERS_TABLE_COLUMNS_LIST,
    VOTER_STATE,
    VOTERS_FILTER_STATE,
  } from '@/constants/vote.js';
  import useGetVoteDetailDefault from '@/lib/queries/vote/useGetVoteDetailDefault.js';
  import useGetVoteDetailVoters from '@/lib/queries/vote/useGetVoteDetailVoters.js';
  import useGetVoteDetailVotersExcel from '@/lib/queries/vote/useGetVoteDetailVotersExcel.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatContact from '@/lib/utils/formatContact.js';

  const { voteDetailVoters, isVoteDetailVotersLoading } =
    useGetVoteDetailVoters();

  const { voteDetailDefault, isVoteDetailDefaultLoading } =
    useGetVoteDetailDefault();

  const { isVoteDetailVotersExcelLoading, refetchVoteDetailVotersExcel } =
    useGetVoteDetailVotersExcel();

  const modalType = ref(null);
  const selectedRowInfo = ref({});

  const findVoteStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-alerts-warning-background-warning';
      case 'VOTED':
        return 'bg-alerts-success-background-success';
      case 'UN_VOTED':
        return 'bg-defaults-tertiary-background-tertiary';
      default:
        break;
    }
  };

  const handleSignButton = (row) => {
    modalType.value = 'sign';
    selectedRowInfo.value = row;
  };

  const closeModal = () => {
    modalType.value = null;
  };
</script>

<template>
  <SearchBar
    :search-input="DETAIL_VOTERS_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isVoteDetailVotersLoading"
  >
    <FilterCheckboxGroup :filter="VOTERS_FILTER_STATE" />
  </SearchBar>
  <div class="flex w-full justify-end gap-2">
    <SpinnerCircle v-if="isVoteDetailDefaultLoading" />
    <template v-else>
      <VoteMessageButton :vote-info="voteDetailDefault" />
      <ButtonExcelDown
        :download-fn="refetchVoteDetailVotersExcel"
        :is-loading="isVoteDetailVotersExcelLoading"
        :disabled="voteDetailVoters?.content?.length <= 0"
      />
    </template>
  </div>
  <TableView
    :column-data="DETAIL_VOTERS_TABLE_COLUMNS_LIST"
    :page-data="voteDetailVoters"
    pageable
    show-count
  >
    <template #default="{ row, column }">
      <template v-if="isVoteDetailVotersLoading">
        <SkeletonBase class="h-5 rounded-md" />
      </template>
      <template v-else>
        <div
          v-if="column.key === 'voterStatus'"
          class="flex items-center gap-4"
        >
          <span
            :class="`h-3 w-3 rounded-xl ${findVoteStatusStyle(row[column.key])}`"
          />
          <span>{{ VOTER_STATE[row[column.key]] }}</span>
        </div>
        <div v-else-if="column.key === 'sign'">
          <button
            v-if="row?.signFileUrl"
            type="button"
            class="underline underline-offset-4"
            @click="handleSignButton(row)"
          >
            서명보기
          </button>
        </div>
        <div v-else-if="column.key === 'phone'">
          {{ formatContact(decodeUrl(row[column.key])) }}
        </div>
        <div v-else>{{ decodeUrl(row[column.key]) }}</div>
      </template>
    </template>
  </TableView>
  <VoteDetailVotersSignModal
    v-if="modalType === 'sign'"
    :info="selectedRowInfo"
    @close="closeModal"
  />
</template>
