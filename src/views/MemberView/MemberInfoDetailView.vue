<script setup>
  import IconEditLineBlack from '@assets/icons/icon-edit-line-black.svg';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipApprovalState from '@components/common/ChipApprovalState.vue';
  import EmptyView from '@components/common/EmptyView.vue';
  import MemberInfoApproveModal from '@views/MemberView/MemberInfoApproveModal.vue';
  import MemberInfoDeleteModal from '@views/MemberView/MemberInfoDeleteModal.vue';
  import MemberInfoEditModal from '@views/MemberView/MemberInfoEditModal.vue';
  import MemberInfoRejectModal from '@views/MemberView/MemberInfoRejectModal.vue';
  import MemberInfoWaitingModal from '@views/MemberView/MemberInfoWaitingModal.vue';
  import { ref } from 'vue';

  import { RESIDENT_TYPE } from '@/constants/common.js';
  import {
    ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES,
    ADMIN_MEMBER_MEMBERINFO_DETAIL_BASIC_INFO_LIST,
  } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetResidentDetail from '@/lib/queries/member/useGetResidentDetail.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { getParams } = useNavigate();

  const { residentDetail, isResidentDetailLoading } = useGetResidentDetail({
    residentUuid: getParams().uuid,
  });

  const modalType = ref(null);

  const openModal = (type) => {
    modalType.value = type;
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const findResidentType = (key) => {
    const foundType = RESIDENT_TYPE.find((type) => type.key === key);

    return foundType?.label;
  };

  const formatValue = (key, value) => {
    switch (key) {
      case 'phone':
        return formatContact(value);
      case 'residentType':
        return findResidentType(value);
      case 'createdDate':
        return formatDate(value).date();
      case 'testFlag':
        return value ? '예' : '아니오';
      default:
        return value;
    }
  };
</script>

<template>
  <section class="w-full border-b border-b-dark-100 p-8">
    <ButtonBack />
    <div class="flex justify-between">
      <div>
        <h2 class="pretendard-h3">
          {{ residentDetail?.name || '등록 회원 정보 상세' }}
        </h2>
        <div
          class="flex items-center gap-1 text-base leading-7 text-muted-foreground-100"
        >
          {{
            residentDetail?.dong !== undefined &&
            residentDetail?.ho !== undefined
              ? `${residentDetail?.dong}동 ${residentDetail?.ho}호`
              : '정보없음'
          }}
        </div>
      </div>
      <div v-if="!isResidentDetailLoading" class="flex items-center gap-2">
        <ButtonBase
          v-if="
            residentDetail?.state ===
              ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.WAITING ||
            residentDetail?.state ===
              ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.REJECTED
          "
          type="button"
          color="primary"
          size="md"
          @click="openModal('approve')"
        >
          가입 승인
        </ButtonBase>
        <ButtonBase
          v-if="
            residentDetail?.state ===
            ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.WAITING
          "
          type="button"
          color="destructive"
          size="md"
          @click="openModal('reject')"
        >
          반려
        </ButtonBase>
        <ButtonBase
          v-if="
            residentDetail?.state ===
              ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.APPROVED ||
            residentDetail?.state ===
              ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.REJECTED
          "
          type="button"
          color="secondary-fill"
          size="md"
          @click="openModal('waiting')"
        >
          대기상태로 되돌리기
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          @click="openModal('delete')"
        >
          전출 처리
        </ButtonBase>
      </div>
    </div>
  </section>
  <section class="border-b border-b-dark-100 p-8">
    <div class="mb-6 flex justify-between">
      <h3 class="flex items-center pretendard-h4">기본 정보</h3>

      <MemberInfoEditModal
        v-if="residentDetail"
        mode="edit"
        :resident-detail="residentDetail"
      >
        <template #member-button>
          <button type="button" class="flex items-center gap-2 px-4 py-2">
            <IconEditLineBlack class="h-4 w-4" />
            <span>수정</span>
          </button>
        </template>
      </MemberInfoEditModal>
    </div>
    <ul v-if="residentDetail" class="flex flex-col gap-6 text-sm font-normal">
      <li
        v-for="info in ADMIN_MEMBER_MEMBERINFO_DETAIL_BASIC_INFO_LIST"
        :key="info.key"
        class="flex h-[22px] leading-[14px]"
      >
        <span class="w-[200px] font-semibold">{{ info.label }}</span>
        <ChipApprovalState
          v-if="info.key === 'state'"
          :state="residentDetail.state"
        />
        <span v-else>{{
          formatValue(info.key, residentDetail[info.key])
        }}</span>
      </li>
    </ul>
    <EmptyView v-else />
  </section>
  <MemberInfoApproveModal v-if="modalType === 'approve'" @close="closeModal" />
  <MemberInfoRejectModal v-if="modalType === 'reject'" @close="closeModal" />
  <MemberInfoWaitingModal
    v-if="modalType === 'waiting'"
    :resident-name="residentDetail?.name || ''"
    @close="closeModal"
  />
  <MemberInfoDeleteModal
    v-if="modalType === 'delete'"
    :resident-name="residentDetail?.name || ''"
    @close="closeModal"
  />
</template>
