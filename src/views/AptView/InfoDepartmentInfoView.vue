<script setup>
  import IconDeleteLineBlack from '@assets/icons/icon-delete-line-black.svg';
  import IconPlusLineBlack from '@assets/icons/icon-plus-line-black.svg';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import _ from 'lodash';
  import { Field, FieldArray, useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import useGetAptDepartmentContact from '@/lib/queries/apt/useGetAptDepartmentContact.js';
  import usePutAptDepartmentContact from '@/lib/queries/apt/usePutAptDepartmentContact.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { aptOfficeContactFormSchema } from '@/schemas/apt.js';

  const { aptDepartmentDetail, isAptDepartmentDetailLoading } =
    useGetAptDepartmentContact();

  const {
    putAptDepartmentContactMutationAsync,
    isPutAptDepartmentContactPending,
  } = usePutAptDepartmentContact();

  const { errors, handleSubmit, setValues, setFieldValue, resetForm } = useForm(
    {
      validationSchema: aptOfficeContactFormSchema,
    },
  );

  const isEditingRef = ref(false);

  const closeEditForm = () => {
    isEditingRef.value = false;
  };

  const editForm = () => {
    isEditingRef.value = true;
  };

  const cancelForm = () => {
    const cloneDeepDetails = _.cloneDeep(aptDepartmentDetail.value).map(
      (item) => {
        return { name: item.name, phone: formatContact(item.phone) };
      },
    );

    resetForm({
      values: {
        departmentContact: cloneDeepDetails,
      },
    });

    closeEditForm();
  };

  const onSubmit = handleSubmit(async (submitValues) => {
    await putAptDepartmentContactMutationAsync({
      departmentContact: submitValues.departmentContact,
    });
    closeEditForm();
  });

  const handlePhoneInputChange = (event, index) => {
    let value = event.target.value.replace(/\D/g, '');

    // 최대 13자까지만 입력 허용 (하이픈 포함)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    setFieldValue(`departmentContact[${index}].phone`, formatContact(value));
  };

  watch(
    aptDepartmentDetail,
    (newValue) => {
      if (!newValue) {
        return;
      }

      const cloneDeepNewValue = _.cloneDeep(newValue).map((item) => {
        return { name: item.name, phone: formatContact(item.phone) };
      });

      setValues({
        departmentContact: cloneDeepNewValue,
      });
    },
    { immediate: true },
  );

  useUnsavedChangesGuard([isEditingRef]);
</script>

<template>
  <div
    v-if="isAptDepartmentDetailLoading"
    class="mb-12 flex w-[484px] flex-col gap-4"
  >
    <SkeletonBar v-for="index in 5" :key="index" />
  </div>
  <form v-else id="departmentContactForm">
    <FieldArray v-slot="{ fields, push, remove }" name="departmentContact">
      <p v-if="fields?.length <= 0" class="py-16 text-center">
        등록된 부서별 연락처가 없습니다.<br />
        연락처를 추가해주세요.
      </p>
      <ul v-else class="mb-4 flex min-w-[484px] max-w-[484px] flex-col gap-4">
        <li
          v-for="(field, fieldIndex) in fields"
          :key="field.key"
          class="space-y-2"
        >
          <div class="flex items-center gap-2">
            <Field
              :name="`departmentContact[${fieldIndex}].name`"
              type="text"
              placeholder="부서명"
              class="w-36 rounded-md border border-dark-100 px-3 py-2"
              :disabled="!isEditingRef"
            />
            <Field
              :name="`departmentContact[${fieldIndex}].phone`"
              type="tel"
              placeholder="연락처"
              class="w-72 rounded-md border border-dark-100 px-3 py-2"
              :disabled="!isEditingRef"
              @input="(event) => handlePhoneInputChange(event, fieldIndex)"
            />
            <button
              v-if="isEditingRef && field.key > 0"
              type="button"
              title="연락처 삭제"
              class="-mt-2 ml-3"
              @click="remove(fieldIndex)"
            >
              <IconDeleteLineBlack class="h-5 w-5" />
            </button>
          </div>
          <p class="text-xs text-destructive-100">
            {{
              errors[`departmentContact[${fieldIndex}].name`] ||
              errors[`departmentContact[${fieldIndex}].phone`]
            }}
          </p>
        </li>
      </ul>
      <button
        v-if="isEditingRef"
        type="button"
        class="mb-12 flex min-w-[484px] max-w-[484px] items-center justify-center gap-2 rounded-md border border-dashed border-dark-100 px-4 py-2"
        @click="push({ name: '', phone: '' })"
      >
        <IconPlusLineBlack class="h-5 w-5" />
        <span class="pretendard-14SemiBold">연락처 추가</span>
      </button>
    </FieldArray>
    <SettingSubmitButton
      :is-loading="isPutAptDepartmentContactPending"
      :is-editing="isEditingRef"
      :is-manual-submit="true"
      @submit="onSubmit"
      @edit="editForm"
      @cancel="cancelForm"
    />
  </form>
</template>
