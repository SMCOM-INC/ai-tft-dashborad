<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ModalReconfirm from '@components/common/ModalReconfirm.vue';
  import TableView from '@components/common/TableView.vue';

  import { ADMIN_MEMBER_HOUSEHOLD_INFO_DETAIL_TABLE_COLUMNS_LIST } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteHousehold from '@/lib/queries/member/useDeleteHousehold.js';
  import useDeleteResident from '@/lib/queries/member/useDeleteResident.js';
  import useGetHouseholdDetail from '@/lib/queries/member/useGetHouseholdDetail.js';

  const { navigateTo } = useNavigate();

  const { householdDetail, isHouseholdDetailLoading } = useGetHouseholdDetail();

  const {
    deleteHouseholdMutation,
    isDeleteHouseholdPending,
    isDeleteHouseholdError,
    deleteHouseholdError,
  } = useDeleteHousehold();

  const {
    deleteResidentMutationAsync,
    isDeleteResidentPending,
    isDeleteResidentError,
    deleteResidentError,
  } = useDeleteResident();

  const deleteHousehold = () => {
    deleteHouseholdMutation();
  };

  const deleteResident = (residentUuid) => {
    deleteResidentMutationAsync({ residentUuid });
  };

  const clickRow = (row) => {
    navigateTo(`/member/member-info/detail/${row.uuid}`);
  };
</script>

<template>
  <template v-if="!isHouseholdDetailLoading">
    <section class="w-full border-b border-b-dark-100 p-8">
      <ButtonBack />
      <div class="flex items-start justify-between">
        <h2 class="pretendard-h3">
          {{
            householdDetail !== undefined
              ? `${householdDetail?.dong}동 ${householdDetail?.ho}호`
              : '세대 정보 상세'
          }}
        </h2>
        <div v-if="householdDetail !== undefined" class="flex gap-2">
          <ModalReconfirm
            trigger-button-name="세대 전출 처리"
            title="정말로 세대 전출 처리를 하시겠습니까?"
            paragraph="전출 처리 후 복구될 수 없습니다. 해당 세대의 모든 값이 초기화됩니다. 전출 처리할 세대 동호수를 정확하게 입력해주세요."
            :placeholder="`${householdDetail?.dong}동 ${householdDetail?.ho}호`"
            field-id="aptName"
            color="red"
            close-button-name="세대 전출 처리"
            :is-loading="isDeleteHouseholdPending"
            :is-error="isDeleteHouseholdError"
            :error="deleteHouseholdError"
            :close-button-handler="() => deleteHousehold(householdDetail.uuid)"
          />
        </div>
      </div>
    </section>
    <section class="p-8">
      <h3 class="mb-6 flex items-center gap-2 pretendard-h4">
        <span>구성원</span>
        <span class="text-muted-foreground-100 pretendard-h4">{{
          householdDetail?.residentList.length
        }}</span>
      </h3>
      <TableView
        :column-data="ADMIN_MEMBER_HOUSEHOLD_INFO_DETAIL_TABLE_COLUMNS_LIST"
        :page-data="{ content: householdDetail?.residentList }"
        :pageable="false"
        show-count
        :row-function="clickRow"
      >
        <template #default="{ row, column }">
          <div v-if="column?.key === 'button'">
            <ModalReconfirm
              trigger-button-name="전출 처리"
              title="정말로 전출 처리를 하시겠습니까?"
              paragraph="전출 처리 후 복구될 수 없습니다. 해당 세대에서만 전출 처리 되며, 탈퇴는 별도로 처리가 필요합니다. 전출 처리할 회원 이름을 정확하게 입력해주세요."
              color="red"
              field-id="memberName"
              close-button-name="세대원 전출 처리"
              :placeholder="row?.name"
              :outlined="true"
              :is-loading="isDeleteResidentPending"
              :is-error="isDeleteResidentError"
              :error="deleteResidentError"
              :close-button-handler="() => deleteResident(row.uuid)"
            />
          </div>
        </template>
      </TableView>
    </section>
  </template>
</template>
