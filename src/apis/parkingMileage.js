import { auth } from '@/apis/axios.js';
import downloadFile from '@/lib/utils/downloadFile.js';

// 세대 마일리지 사용 내역 리스트 조회
export const getMileageList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  remainingMileageLoeFilter,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        remainingMileageLoeFilter,
      },
    },
  );

  return response;
};

// 세대 마일리지 사용 내역 엑셀 다운로드
export const getMileageExcel = async ({
  aptUuid,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  remainingMileageLoeFilter,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage/excel`,
    {
      params: {
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        remainingMileageLoeFilter,
      },
      responseType: 'blob',
    },
  );

  downloadFile({
    data: response.data,
    type: 'xlsx',
    fileName: `세대별 마일리지 사용내역_${startDateTime.split(' ')[0]}_${endDateTime.split(' ')[0]}`,
  });

  return response;
};

// 마일리지 상세조회
export const getMileageDetail = async ({
  aptUuid,
  mileageUuid,
  size,
  page,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage/${mileageUuid}/inout-parking`,
    {
      params: {
        size,
        page,
      },
    },
  );

  return response;
};
