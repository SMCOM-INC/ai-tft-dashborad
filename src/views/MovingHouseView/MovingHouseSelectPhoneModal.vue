<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import { ref } from 'vue';

  const emits = defineEmits(['close', 'select']);
  const selectedContact = ref('');

  const CONTACT_MOCKS = [
    '101 101 문상훈',
    '101 102 김혜윤',
    '101 103 변우석',
    '101 104 하하하',
  ];
  const closeModal = () => {
    emits('close');
  };

  const handleSelect = () => {
    emits('select', selectedContact.value);
    closeModal();
  };
</script>

<template>
  <div
    class="fixed left-[0px] top-[0px] z-50 flex h-screen w-screen items-center justify-center bg-black/50 p-5"
    @click="closeModal"
  >
    <div class="absolute min-w-[400px] rounded-md bg-white" @click.stop>
      <h1 class="border-b border-b-[#E2E8F0] px-6 py-4 pretendard-h4">
        연락처 선택
      </h1>
      <div class="flex flex-col gap-6 p-6">
        <ul class="flex flex-col gap-3 p-6">
          <li v-for="contact in CONTACT_MOCKS" :key="contact">
            <label
              :for="contact"
              name="contact"
              class="flex items-center gap-2 rounded-lg bg-secondary-100 p-4 font-medium"
            >
              <input
                :id="contact"
                v-model="selectedContact"
                :value="contact"
                type="radio"
                name="contact"
              />
              {{ contact }}
            </label>
          </li>
        </ul>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            custom-class="inline"
            @click="closeModal"
          >
            닫기
          </ButtonBase>
          <ButtonBase
            type="button"
            color="primary"
            @click="handleSelect"
          >
            선택하기
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>
