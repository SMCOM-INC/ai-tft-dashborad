import { auth } from '@/apis/axios.js';

// 미출차내역 리스트 조회
export const getNotOutHistoryList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  carTypeList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/not-out-parking`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        carTypeList,
      },
    },
  );

  return response;
};

// 미출차 리스트 엑셀 다운로드
export const getNotOutHistoryListExcel = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  carTypeList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/not-out-parking/excel`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        carTypeList,
      },
      responseType: 'blob',
    },
  );

  return response;
};

// 미출차내역 출차 생성
export const postNotOutHistoryOutGate = async ({
  aptUuid,
  inParkingUuid,
  outParkingDateTime,
  outLprUuid,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/inout-parking/not-out-parking/${inParkingUuid}`,
    { outParkingDateTime, outLprUuid },
  );

  return response;
};
