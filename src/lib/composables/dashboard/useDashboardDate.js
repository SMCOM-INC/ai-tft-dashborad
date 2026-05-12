import { computed, ref } from 'vue';

const useDashboardDate = () => {
  const now = new Date();

  const selectedDate = ref(now);

  const formattedDate = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const changeDate = (value) => {
    selectedDate.value = value;
  };

  // minDate: 저저번달 1일 (2개월 전)
  const minDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  // maxDate: 오늘
  const maxDate = now;

  return {
    selectedDate,
    formattedDate,
    changeDate,
    minDate,
    maxDate,
  };
};

export default useDashboardDate;
