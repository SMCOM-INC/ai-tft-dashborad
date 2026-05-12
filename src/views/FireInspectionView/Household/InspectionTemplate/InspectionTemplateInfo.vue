<script setup>
  import InputText from '@components/common/InputText.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useField } from 'vee-validate';
  import { computed, nextTick } from 'vue';

  import { FIRE_INSPECTION_SUBMISSION_TYPES } from '@/constants/fireInspection.js';
  import formatContact from '@/lib/utils/formatContact.js';

  import '@vuepic/vue-datepicker/dist/main.css';

  const props = defineProps({
    householdInfo: {
      type: Object,
      required: true,
    },
  });

  const { value: inspector } = useField('inspector');
  const { value: submissionType } = useField('submissionType');
  const { value: inspectorPhone } = useField('inspectorPhone');
  const { value: submissionDateTime } = useField('submissionDateTime');

  const isDisabled = computed(() => {
    return !!props.householdInfo.inspector;
  });

  const handlePhoneInput = async (event) => {
    const { target } = event;
    const digits = target.value.replace(/\D/g, '').slice(0, 11);
    const formatted = formatContact(digits);

    // firefox dom 업데이트 안되는 것 대응
    inspectorPhone.value = formatted;
    await nextTick();
    target.value = formatted;
  };

  // 구분 라벨 가져오기
  const getSubmissionTypeLabel = (key) => {
    const type = FIRE_INSPECTION_SUBMISSION_TYPES.find((t) => t.key === key);
    return type?.label || '-';
  };
</script>

<template>
  <div class="rounded-md border border-defaults-primary-border-primary">
    <table class="w-full">
      <tbody>
        <!-- Row 1: 동, 호, 점검자 -->
        <tr class="border-b border-b-defaults-primary-border-primary">
          <th
            class="w-24 rounded-tl-md bg-defaults-secondary-background-secondary px-3 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            동
          </th>
          <td class="w-56 px-3 py-1.5">
            <span
              class="text-defaults-primary-text-primary pretendard-14Regular"
            >
              {{ householdInfo.dong }}
            </span>
          </td>
          <th
            class="w-24 bg-defaults-secondary-background-secondary px-6 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            호
          </th>
          <td class="w-56 px-3 py-1.5">
            <span
              class="text-defaults-primary-text-primary pretendard-14Regular"
            >
              {{ householdInfo.ho }}
            </span>
          </td>
          <th
            class="w-24 bg-defaults-secondary-background-secondary px-6 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            점검자
          </th>
          <td class="w-56 px-6 py-4">
            <InputText
              v-if="!isDisabled"
              id="inspector"
              key="input-text-1"
              type="text"
              size="lg"
              placeholder="점검자 이름을 입력하세요"
            />
            <span v-else class="pretendard-14Regular">
              {{ inspector || '-' }}
            </span>
          </td>
        </tr>

        <!-- Row 2: 구분, 연락처, 점검일 -->
        <tr>
          <th
            class="w-24 rounded-bl-md bg-defaults-secondary-background-secondary px-3 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            구분
          </th>
          <td class="w-56 px-3 py-1.5">
            <div v-if="!isDisabled" class="flex gap-6">
              <label
                v-for="option in FIRE_INSPECTION_SUBMISSION_TYPES"
                :key="option.key"
                class="flex cursor-pointer items-center gap-2"
              >
                <input
                  :checked="submissionType === option.key"
                  type="radio"
                  name="submissionType"
                  :value="option.key"
                  class="h-4 w-4"
                  @change="submissionType = option.key"
                />
                <span class="pretendard-14Regular">
                  {{ option.label }}
                </span>
              </label>
            </div>
            <span v-else class="pretendard-14Regular">
              {{ getSubmissionTypeLabel(submissionType) }}
            </span>
          </td>
          <th
            class="w-24 bg-defaults-secondary-background-secondary px-6 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            연락처
          </th>
          <td class="w-56 px-3 py-1.5">
            <InputText
              v-if="!isDisabled"
              id="inspectorPhone"
              type="tel"
              size="lg"
              placeholder="예) 010-0000-0000"
              @input="handlePhoneInput"
            />
            <span v-else class="pretendard-14Regular">
              {{ formatContact(inspectorPhone) || '-' }}
            </span>
          </td>
          <th
            class="w-24 bg-defaults-secondary-background-secondary px-6 py-1.5 text-left text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            제출일
          </th>
          <td class="w-56 rounded-br-md px-6 py-4">
            <div v-if="!isDisabled" class="space-y-1">
              <VueDatePicker
                v-model="submissionDateTime"
                locale="ko"
                :enable-time-picker="false"
                :auto-apply="true"
                format="yyyy-MM-dd"
                placeholder="날짜를 선택하세요"
              />
            </div>
            <span v-else class="pretendard-14Regular">
              {{ submissionDateTime || '-' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
