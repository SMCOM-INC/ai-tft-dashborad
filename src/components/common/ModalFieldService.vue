<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import { Field } from 'vee-validate';
  import { ref, watchEffect } from 'vue';

  import useGetAptContentList from '@/lib/queries/apt/useGetAptContentList.js';

  const props = defineProps({
    isEditMode: {
      type: Boolean,
      default: false,
    },
    aptServices: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:model-value']);

  const { contentList, isContentListLoading, isSuccess, isError, error } =
    useGetAptContentList();

  const initialSetupDone = ref(false);
  const selectedServicesRef = ref([]);

  const handleInitialSetup = () => {
    if (!contentList.value || initialSetupDone.value) return;

    if (props.isEditMode && props.aptServices.length > 0) {
      selectedServicesRef.value = contentList.value.map((service) => ({
        ...service,
        checked: props.aptServices.some(
          (selectedService) => selectedService.uuid === service.uuid,
        ),
      }));
    } else {
      selectedServicesRef.value = contentList.value.map((service) => ({
        ...service,
        checked: false,
      }));
    }
    initialSetupDone.value = true;
  };

  const toggleService = (uuid) => {
    const serviceIndex = selectedServicesRef.value.findIndex(
      (s) => s.uuid === uuid,
    );
    if (serviceIndex !== -1) {
      const updatedServices = [...selectedServicesRef.value];
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        checked: !updatedServices[serviceIndex].checked,
      };
      selectedServicesRef.value = updatedServices;

      const checkedUuids = selectedServicesRef.value
        .filter((s) => s.checked)
        .map((s) => s.uuid);

      emit('update:model-value', checkedUuids);
    }
  };

  watchEffect(() => {
    if (contentList.value) {
      selectedServicesRef.value = contentList.value;
      if (!initialSetupDone.value) {
        handleInitialSetup();
      }
    }
  });
</script>

<template>
  <li class="flex flex-col gap-2">
    <LabelBase label-for="service" label-text="사용 서비스" asterisk />
    <ul v-if="isSuccess" class="flex w-full flex-wrap gap-2">
      <li
        v-for="(service, serviceIndex) in selectedServicesRef"
        :key="service.uuid"
      >
        <LabelBase
          :label-for="`${service.name}`"
          :label-text="`${service.name}`"
          :class="`cursor-pointer break-keep rounded-md border p-3 ${
            service.checked
              ? 'border-primary-100 bg-primary-20 text-primary-100'
              : 'border-dark-100 text-muted-foreground-100'
          }`"
          @click="toggleService(service.uuid)"
        />
        <Field
          :id="`${service.name}`"
          :name="`service[${serviceIndex}]`"
          type="checkbox"
          :checked="service.checked"
          class="hidden"
        />
      </li>
    </ul>
    <p
      v-else-if="isContentListLoading"
      class="flex h-full items-center justify-center italic"
    >
      서비스 리스트를 불러오는 중입니다...
    </p>
    <p
      v-else-if="isError"
      class="flex h-full items-center justify-center italic"
    >
      서비스 리스트를 불러오는 중 오류가 발생했습니다: {{ error }}
    </p>
  </li>
</template>
