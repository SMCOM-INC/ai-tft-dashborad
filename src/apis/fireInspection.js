import { auth } from '@/apis/axios.js';

// ///////////////////////////////////////////////////////
// ////////////////////// 점검 관리 //////////////////////
// ///////////////////////////////////////////////////////

// 점검 목록 조회
export const getFireInspectionList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/fire-inspection`,
  );

  return response;
};

// 신규 점검 등록
export const postFireInspection = async ({
  aptUuid,
  title,
  startDate,
  endDate,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/fire-inspection`,
    {
      title,
      startDate,
      endDate,
    },
  );

  return response;
};

// 점검 삭제
export const deleteFireInspection = async ({ aptUuid, fireInspectionUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}`,
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 세대 점검 //////////////////////
// ///////////////////////////////////////////////////////

// 세대별 현황 목록 조회
export const getFireInspectionHouseholdList = async ({
  aptUuid,
  fireInspectionUuid,
  searchType,
  keyword,
  submissionStatus,
  page,
  size,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}/household`,
    {
      params: {
        searchType,
        keyword,
        submissionStatus,
        page,
        size,
      },
    },
  );

  return response;
};

// 세대별 현황 목록 조회 엑셀 다운로드
export const getFireInspectionHouseholdListExcel = async ({
  aptUuid,
  fireInspectionUuid,
  searchType,
  keyword,
  submissionStatus,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}/household/excel`,
    {
      responseType: 'blob',
      params: {
        searchType,
        keyword,
        submissionStatus,
      },
    },
  );

  return response;
};

// 세대 점검 상세 조회
export const getFireInspectionHouseholdDetail = async ({
  aptUuid,
  fireInspectionUuid,
  householdFireInspectionUuid,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}/household/${householdFireInspectionUuid}`,
  );

  return response;
};

// 세대 점검 수기등록
export const postFireInspectionHousehold = async ({
  aptUuid,
  fireInspectionUuid,
  householdUuid,
  submissionType,
  inspector,
  inspectorPhone,
  submissionDateTime,
  questionAnswerList,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}/household/${householdUuid}`,
    {
      submissionType,
      inspector,
      inspectorPhone,
      submissionDateTime,
      questionAnswerList,
    },
  );

  return response;
};

// 세대 점검 삭제
export const deleteFireInspectionHousehold = async ({
  aptUuid,
  fireInspectionUuid,
  householdFireInspectionUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/fire-inspection/${fireInspectionUuid}/household/${householdFireInspectionUuid}`,
  );

  return response;
};
