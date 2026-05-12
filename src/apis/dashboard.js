import { auth } from '@/apis/axios.js';

// 아파트 정보 조회
export const getDashboardAptInfo = async ({ aptUuid }) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/dashboard/base-info`,
  );

  return response;
};

// 시간대별 점유율 조회
export const getDashboardParkingCount = async ({
  aptUuid,
  date,
  inOutType,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/dashboard/hourly-inout-count`,
    {
      params: {
        date,
        inOutType,
      },
    },
  );

  return response;
};

// 마일리지 사용량별 세대 수 비율 조회
export const getDashboardMileageHouseCount = async ({ aptUuid, yearMonth }) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/dashboard/mileage-usage-rate`,
    {
      params: {
        yearMonth,
      },
    },
  );

  return response;
};

// 차량 유형 비율 조회
export const getDashboardCarType = async ({ aptUuid, yearMonth }) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/dashboard/car-type-rate`,
    {
      params: {
        yearMonth,
      },
    },
  );

  return response;
};
