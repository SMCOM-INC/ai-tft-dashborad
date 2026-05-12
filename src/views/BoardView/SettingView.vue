<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import { cloneDeep, set } from 'lodash';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import {
    BOARD_SETTING_AUTHOR_OPTION_LIST,
    BOARD_SETTING_FORM_CONFIG,
    BOARD_SETTING_HOUSEHOLD_INFO_OPTION_LIST,
    BOARD_SETTING_INITIAL_VALUES,
  } from '@/constants/board.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import useGetAptDetail from '@/lib/queries/apt/useGetAptDetail.js';
  import useGetMasterAptDetail from '@/lib/queries/apt/useGetMasterAptDetail.js';
  import useGetBoardSetting from '@/lib/queries/board/useGetBoardSetting.js';
  import usePatchBoardSetting from '@/lib/queries/board/usePatchBoardSetting.js';
  import useGetCommunityCategoryList from '@/lib/queries/boardCommunity/useGetCommunityCategoryList.js';
  import usePostCommunityCategory from '@/lib/queries/boardCommunity/usePostCommunityCategory.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import findAptActiveContentList from '@/lib/utils/findAptActiveContentList.js';
  import {
    combinedAuthorDisplay,
    deconstructAuthorDisplay,
  } from '@/lib/utils/formatBoard.js';
  import { boardSettingFormSchema } from '@/schemas/board.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  // 폼 정책(post/comment) -> API 요청용 enum 값으로 변환
  const transformPolicyToApiDisplay = (policy) => ({
    post: combinedAuthorDisplay(policy.post.householdInfo, policy.post.author),
    comment: combinedAuthorDisplay(
      policy.comment.householdInfo,
      policy.comment.author,
    ),
  });

  // API 응답 enum 값 -> 폼 정책(post/comment) 객체로 변환
  const transformApiDisplayToPolicy = (postDisplay, commentDisplay) => ({
    post: deconstructAuthorDisplay(postDisplay),
    comment: deconstructAuthorDisplay(commentDisplay),
  });

  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();
  const { aptUuid } = userInfo;

  const isEditingRef = ref(false);
  const createBaseCommunityCategoryModalRef = ref(null);
  const availableServicesRef = ref(null);

  const isAdminRoleRef = computed(
    () => token.userRole === 'master' || token.userRole === 'middle_admin',
  );

  // 게시판 설정 상세 조회
  const { boardSettingDetail, isBoardSettingDetailLoading } =
    useGetBoardSetting(aptUuid);

  // 아파트 상세 조회
  const { aptDetail, isAptDetailLoading } =
    token.userRole === 'master'
      ? useGetMasterAptDetail(userInfo.aptUuid)
      : useGetAptDetail();

  // 게시판 설정 수정 mutation
  const { patchBoardSettingMutation, isPatchBoardSettingPending } =
    usePatchBoardSetting();

  // 소통공간 기본 카테고리 생성 mutation
  const {
    postBaseCommunityCategoryMutation,
    isPostBaseCommunityCategoryPending,
    isPostBaseCommunityCategoryError,
    postBaseCommunityCategoryError,
  } = usePostCommunityCategory();

  // 소통공간 카테고리 목록 조회
  const { communityCategoryList, isCommunityCategoryListLoading } =
    useGetCommunityCategoryList();

  const isCommunityCategoryListEmptyRef = computed(
    () =>
      !isCommunityCategoryListLoading.value &&
      communityCategoryList.value?.length === 0,
  );

  // 폼 validation 설정
  const { handleSubmit, setValues, values } = useForm({
    validationSchema: boardSettingFormSchema,
    initialValues: BOARD_SETTING_INITIAL_VALUES,
  });

  // 수정 모드 활성화 핸들러
  const handleEdit = () => {
    isEditingRef.value = true;
  };

  // 게시판 설정 수정 submit 핸들러
  const onSubmit = handleSubmit((formValues) => {
    swalConfirmModal({
      text: '게시판 설정을 수정하시겠습니까?',
      callback: async () => {
        const communityDisplay = transformPolicyToApiDisplay(
          formValues.communityPolicy,
        );
        const complaintDisplay = transformPolicyToApiDisplay(
          formValues.complaintPolicy,
        );

        await patchBoardSettingMutation({
          communityAuthorDisplay: communityDisplay.post,
          communityCommentAuthorDisplay: communityDisplay.comment,
          complaintAuthorDisplay: complaintDisplay.post,
          complaintCommentAuthorDisplay: complaintDisplay.comment,
        });

        isEditingRef.value = false;
      },
    });
  });

  // 소통공간 기본 카테고리 생성 핸들러
  const handleCreateBaseCommunityCategoryAction = async () => {
    await postBaseCommunityCategoryMutation();
  };

  // 서버 데이터로 폼 값 설정
  const setFormValuesFromDetail = (detail) => {
    setValues({
      communityPolicy: transformApiDisplayToPolicy(
        detail.communityAuthorDisplay,
        detail.communityCommentAuthorDisplay,
      ),
      complaintPolicy: transformApiDisplayToPolicy(
        detail.complaintAuthorDisplay,
        detail.complaintCommentAuthorDisplay,
      ),
    });
  };

  // 수정 취소 핸들러
  const handleCancel = () => {
    isEditingRef.value = false;

    // 원래 서버 데이터로 리셋
    if (boardSettingDetail.value) {
      setFormValuesFromDetail(boardSettingDetail.value);
    }
  };

  // 활성화된 서비스에 따라 폼 설정 필터링
  const filteredBoardSettingFormConfig = computed(() => {
    return BOARD_SETTING_FORM_CONFIG.filter((config) => {
      if (
        config.key === 'communityPolicy' &&
        !availableServicesRef.value?.boardMenuList?.includes('community')
      ) {
        return false;
      }
      if (
        config.key === 'complaintPolicy' &&
        !availableServicesRef.value?.boardMenuList?.includes('complaints')
      ) {
        return false;
      }
      return true;
    });
  });

  const handleFieldChange = (configKey, sectionKey, fieldKey, event) => {
    const newValues = cloneDeep(values);
    set(
      newValues,
      `${configKey}.${sectionKey}.${fieldKey}`,
      event.target.value,
    );
    setValues(newValues);
  };

  // 서버 데이터 로드 시 폼 값 설정
  watch(
    boardSettingDetail,
    (newVal) => {
      if (newVal) {
        setFormValuesFromDetail(newVal);
      }
    },
    { immediate: true },
  );

  // 아파트 상세 정보 로드 시 활성화된 서비스 설정
  watch(
    aptDetail,
    (newAptDetail) => {
      if (!newAptDetail) return;
      availableServicesRef.value = findAptActiveContentList(
        newAptDetail.contentList,
      );
    },
    {
      deep: true,
      immediate: true,
    },
  );

  useUnsavedChangesGuard([isEditingRef]);
</script>

<template>
  <PageTitleBase
    paragraph="게시판 사용을 위한 기본 설정을 해주세요."
    title="게시판 설정"
  />
  <div
    class="mb-8 w-fit border-b-2 border-b-primary-100 px-6 py-[6px] text-sm font-medium text-primary-100"
  >
    사용자 노출 정책
  </div>
  <div v-if="isBoardSettingDetailLoading || isAptDetailLoading">
    <SkeletonBar v-for="i in 2" :key="i" />
  </div>
  <form
    v-else
    id="boardSettingForm"
    class="mb-8 flex w-fit flex-col gap-8 font-medium"
  >
    <div
      v-for="config in filteredBoardSettingFormConfig"
      :key="config.key"
      class="flex flex-col gap-2"
    >
      <div class="text-base">{{ config.title }}</div>
      <div
        v-for="section in config.sections"
        :key="section.key"
        class="flex items-center gap-6"
      >
        <legend class="w-20">{{ section.legend }}</legend>
        <LabelBase
          :label-for="`${config.key}.${section.key}.householdInfo`"
          label-text="동 · 호수"
        />
        <select
          :id="`${config.key}.${section.key}.householdInfo`"
          :disabled="!isEditingRef"
          :name="`${config.key}.${section.key}.householdInfo`"
          :value="values[config.key]?.[section.key]?.householdInfo"
          class="icon-chevron-down select-background-position-custom z-10 w-40 cursor-pointer rounded-md border bg-no-repeat py-2 pl-3 pr-[38px] disabled:bg-foreground-10 disabled:text-foreground-50"
          @change="
            handleFieldChange(config.key, section.key, 'householdInfo', $event)
          "
        >
          <option
            v-for="option in BOARD_SETTING_HOUSEHOLD_INFO_OPTION_LIST"
            :key="option.key"
            :value="option.key"
          >
            {{ option.label }}
          </option>
        </select>
        <LabelBase
          :label-for="`${config.key}.${section.key}.author`"
          label-text="작성자"
        />
        <select
          :id="`${config.key}.${section.key}.author`"
          :disabled="!isEditingRef"
          :name="`${config.key}.${section.key}.author`"
          :value="values[config.key]?.[section.key]?.author"
          class="icon-chevron-down select-background-position-custom z-10 w-40 cursor-pointer rounded-md border bg-no-repeat py-2 pl-3 pr-[38px] disabled:bg-foreground-10 disabled:text-foreground-50"
          @change="handleFieldChange(config.key, section.key, 'author', $event)"
        >
          <option
            v-for="option in BOARD_SETTING_AUTHOR_OPTION_LIST"
            :key="option.key"
            :value="option.key"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    <SettingSubmitButton
      :is-editing="isEditingRef"
      :is-loading="isPatchBoardSettingPending"
      :is-manual-submit="true"
      @submit="onSubmit"
      @cancel="handleCancel"
      @edit="handleEdit"
    />
  </form>
  <ModalParagraph
    v-if="isAdminRoleRef && isCommunityCategoryListEmptyRef"
    ref="createBaseCommunityCategoryModalRef"
    :error="postBaseCommunityCategoryError"
    :is-error="isPostBaseCommunityCategoryError"
    :is-loading="isPostBaseCommunityCategoryPending"
    close-button-name="생성"
    color="deepBlue"
    paragraph="[자유게시판], [정보공유], [문의], [기타] 카테고리가 생성됩니다."
    title="소통공간 기본 카테고리를 생성하시겠습니까?"
    trigger-button-name="소통공간 기본 카테고리 생성"
    @confirm="handleCreateBaseCommunityCategoryAction"
  />
</template>
