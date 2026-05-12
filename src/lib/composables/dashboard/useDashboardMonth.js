import { ref } from 'vue';

const useDashboardMonth = () => {
  const now = new Date();

  // 최근 3개월 리스트 생성 (이번 달, 저번 달, 저저번 달)
  const getRecentMonthsList = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const monthStr = String(month).padStart(2, '0');

      months.push({
        key: `${year}-${monthStr}`,
        label: `${year}년 ${monthStr}월`,
      });
    }
    return months;
  };

  const recentMonths = getRecentMonthsList();

  const monthFilter = {
    filterName: '기간',
    filterKey: 'month',
    list: recentMonths,
  };

  const selectedDate = ref(recentMonths[0].key);

  const changeDate = (value) => {
    selectedDate.value = value;
  };

  return {
    selectedDate,
    changeDate,
    monthFilter,
    recentMonths,
  };
};

export default useDashboardMonth;
