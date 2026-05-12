<script setup>
  import IconCheckFilled from '@assets/icons/icon-checkmark-circle-filled.svg';
  import IconCheckSolid from '@assets/icons/icon-checkmark-circle-solid.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import { computed, ref, watchEffect } from 'vue';


  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import {
    useFetchAptBusinessTypeList,
    useUpdateAptBusinessTypeList,
  } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const isEditing = ref(false);
  useUnsavedChangesGuard([isEditing]);

  const { aptBusinessTypeList, isAptBusinessTypeListLoading } =
    useFetchAptBusinessTypeList(aptUuid);
  const { updateAptBusinessTypeMutation, isUpdateAptBusinessTypeLoading } =
    useUpdateAptBusinessTypeList(aptUuid);

  const aptBusinessTypeListReactive = ref([]);
  const aptBusinessTypeUseCount = computed(() =>
    aptBusinessTypeList.value
      ? aptBusinessTypeList.value.filter((item) => item.isUsed).length
      : 0,
  );
  const aptAllBusinessTypeCount = computed(() =>
    aptBusinessTypeList.value ? aptBusinessTypeList.value.length : 0,
  );

  const handleEdit = () => {
    isEditing.value = true;
  };

  const handleItemClick = (index, event) => {
    if (isEditing.value && aptBusinessTypeListReactive.value[index]) {
      event.preventDefault();
      event.stopPropagation();
      aptBusinessTypeListReactive.value[index].isUsed =
        !aptBusinessTypeListReactive.value[index].isUsed;
    }
  };

  const handleCancel = () => {
    isEditing.value = false;
    aptBusinessTypeListReactive.value = JSON.parse(
      JSON.stringify(aptBusinessTypeList.value),
    );
  };

  const onSubmit = () => {
    const hasChanges = aptBusinessTypeListReactive.value.some(
      (item, index) => item.isUsed !== aptBusinessTypeList.value[index].isUsed,
    );

    if (!hasChanges) {
      handleCancel();
      return;
    }

    swalConfirmModal({
      text: '선택한 업무 목적으로 수정하시겠습니까?',
      callback: async () => {
        const businessTypeUuidList = aptBusinessTypeListReactive.value
          .filter((item) => item.isUsed)
          .map((item) => item.uuid);
        await updateAptBusinessTypeMutation({ businessTypeUuidList });
        handleCancel();
      },
    });
  };

  watchEffect(() => {
    if (aptBusinessTypeList.value) {
      aptBusinessTypeListReactive.value = JSON.parse(
        JSON.stringify(aptBusinessTypeList.value),
      );
    }
  });
</script>

<template>
  <form class="w-fit max-w-[calc(100%-266px)]">
    <div class="mb-8 flex flex-col gap-2">
      <p class="whitespace-nowrap text-muted-foreground-100">
        {{
          isEditing ? '사용할 업무 목적을 선택해주세요.' : '사용 중인 업무 목적'
        }}
        ({{ aptAllBusinessTypeCount }}개 중 {{ aptBusinessTypeUseCount }}개
        사용)
      </p>
      <div v-if="isAptBusinessTypeListLoading">
        <SkeletonBar class="h-10 w-72" />
      </div>
      <ul v-else class="flex flex-wrap gap-2">
        <li
          v-for="(purpose, purposeIndex) in isEditing
            ? aptBusinessTypeListReactive
            : aptBusinessTypeList"
          :key="purpose.name"
          class="mb-2"
          @click.prevent="handleItemClick(purposeIndex, $event)"
        >
          <LabelBase
            :label-for="`${purpose.name}`"
            :class="`flex items-center gap-2 rounded-md border px-3 py-2.5 ${
              isEditing
                ? purpose.isUsed
                  ? 'cursor-pointer border-primary-100 bg-primary-20 text-primary-100'
                  : 'cursor-pointer border-dark-100 text-muted-foreground-100'
                : purpose.isUsed
                  ? 'cursor-not-allowed border-dark-100 bg-gray-200 text-primary-100'
                  : 'cursor-not-allowed border-dark-100 bg-gray-200 text-muted-foreground-100'
            }`"
          >
            <div class="flex items-center gap-2">
              <component
                :is="purpose.isUsed ? IconCheckFilled : IconCheckSolid"
                class="h-4 w-4"
                :class="
                  purpose.isUsed
                    ? 'fill-primary-100'
                    : 'fill-muted-foreground-50'
                "
              />
              <span
                class="select-none whitespace-nowrap text-sm font-medium leading-none"
              >
                {{ purpose.name }}
              </span>
            </div>
          </LabelBase>
          <input
            :id="`${purpose.name}`"
            v-model="aptBusinessTypeListReactive[purposeIndex].isUsed"
            :name="`businessPurpose[${purposeIndex}].isUsed`"
            type="checkbox"
            class="hidden"
          />
        </li>
      </ul>
    </div>
    <SettingSubmitButton
      btn-text="업무목적 수정하기"
      :is-loading="isUpdateAptBusinessTypeLoading"
      :is-editing="isEditing"
      :is-manual-submit="true"
      @submit="onSubmit"
      @edit="handleEdit"
      @cancel="handleCancel"
    />
  </form>
</template>
