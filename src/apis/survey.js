import { auth } from '@/apis/axios.js';

// ///////////////////////////////////////////////////////
// ///////////////////////// 공통 ////////////////////////
// ///////////////////////////////////////////////////////

// 설문조사 삭제
export const deleteSurvey = async ({ aptUuid, surveyUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}`,
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 설문조사 리스트 /////////////////////
// ///////////////////////////////////////////////////////

// 그룹 생성
export const postSurveyGroup = async ({ aptUuid, groupName }) => {
  const response = await auth.post(`/board/apt-admin/${aptUuid}/survey/group`, {
    title: groupName,
  });

  return response;
};

// 그룹 수정
export const patchSurveyGroup = async ({ aptUuid, groupUuid, groupName }) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/group/${groupUuid}`,
    { title: groupName },
  );

  return response;
};

// 그룹 삭제
export const deleteSurveyGroup = async ({ aptUuid, groupUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/survey/group/${groupUuid}`,
  );

  return response;
};

// 설문조사 리스트 조회 및 검색
export const getSurveyList = async ({ aptUuid, searchType, keyword }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/group/list`,
    {
      params: { searchType, keyword },
    },
  );

  return response;
};

// 설문조사 생성
export const postSurvey = async ({ aptUuid, groupUuid, title }) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/survey/${groupUuid}`,
    {
      title,
    },
  );

  return response;
};

// 설문조사 제목 수정
export const patchSurveyTitle = async ({ aptUuid, surveyUuid, title }) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/title`,
    { title },
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 설문조사 등록 ///////////////////////
// ///////////////////////////////////////////////////////

// 상세조회 폼(미완성 조회)
export const getSurveyFormDetail = async ({ aptUuid, surveyUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/unfinish`,
  );

  return response;
};

// 기본정보 저장 및 수정
export const patchSurveyFormDefault = async ({
  aptUuid,
  surveyUuid,
  title,
  authType,
  content,
  imageFileUuidList,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/info`,
    {
      title,
      authType,
      content,
      imageFileUuidList,
    },
  );

  return response;
};

// 참여자리스트 엑셀 샘플 다운로드
export const getSurveyFormSampleExcel = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/vote-example/excel`,
    {
      responseType: 'blob',
    },
  );

  return response;
};

// 참여자리스트 엑셀 저장 및 수정
export const patchSurveyFormExcel = async ({
  aptUuid,
  surveyUuid,
  formData,
  onUploadProgress,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/respondent`,
    formData,
    { onUploadProgress },
  );

  return response;
};

// 질문항목 등록
export const postSurveyQuestion = async ({
  aptUuid,
  surveyUuid,
  questionOptionList,
  content,
  questionType,
  isRequired,
  minChoice,
  maxChoice,
  etcFlag,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/question`,
    {
      questionOptionList,
      content,
      questionType,
      requiredFlag: isRequired,
      minChoice,
      maxChoice,
      etcFlag,
    },
  );

  return response;
};

// 질문항목 수정
export const patchSurveyQuestion = async ({
  aptUuid,
  surveyUuid,
  questionUuid,
  questionOptionList,
  content,
  questionType,
  isRequired,
  minChoice,
  maxChoice,
  etcFlag,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/question/${questionUuid}`,
    {
      questionOptionList,
      content,
      questionType,
      requiredFlag: isRequired,
      minChoice,
      maxChoice,
      etcFlag,
    },
  );

  return response;
};

// 질문항목 삭제
export const deleteSurveyQuestion = async ({
  aptUuid,
  surveyUuid,
  questionUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/question/${questionUuid}`,
  );

  return response;
};

// 설문조사 제출
export const patchSurveySubmit = async ({
  aptUuid,
  surveyUuid,
  startDateTime,
  endDateTime,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/finish`,
    {
      startDateTime,
      endDateTime,
    },
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 설문조사 상세 ///////////////////////
// ///////////////////////////////////////////////////////

// 상세조회 기본
export const getSurveyDetailDefault = async ({ aptUuid, surveyUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/finish`,
  );

  return response;
};

// 상세조회 기본 - 기타 옵션 답변 리스트 조회
export const getSurveyDetailDefaultEtcList = async ({
  aptUuid,
  surveyUuid,
  questionUuid,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/question/${questionUuid}/etc-answer`,
  );

  return response;
};

// 상세조회 기본 - 서술형 답변 리스트 조회
export const getSurveyDetailDefaultSubjectiveList = async ({
  aptUuid,
  surveyUuid,
  questionUuid,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/question/${questionUuid}/subjective-answer`,
  );

  return response;
};

// 상세조회 참여자 조회
export const getSurveyDetailParticipants = async ({
  aptUuid,
  surveyUuid,
  size,
  page,
  searchType,
  keyword,
  statusSearchType,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/respondent`,
    {
      params: {
        size,
        page,
        searchType,
        keyword,
        stateList: statusSearchType,
      },
    },
  );

  return response;
};

// 상세조회 참여자 엑셀다운로드
export const getSurveyDetailParticipantsExcel = async ({
  aptUuid,
  surveyUuid,
  keyword,
  searchType,
  statusSearchType,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/respondent/excel`,
    {
      params: { keyword, searchType, statusSearchType },
      responseType: 'blob',
    },
  );

  return response;
};

// 상세조회 설문조사 PDF 다운로드
export const getSurveyDetailPdf = async ({ aptUuid, surveyUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/pdf`,
    {
      responseType: 'blob',
    },
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 메시지 발송 ///////////////////////
// ///////////////////////////////////////////////////////

// 메시지 발송 예약
export const postSurveySmsReservation = async ({
  aptUuid,
  surveyUuid,
  sendDateTime,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/sms/reservation`,
    {
      sendDateTime,
    },
  );

  return response;
};

// 메시지 발송 예약 리스트 조회
export const getSurveySmsReservationList = async ({ aptUuid, surveyUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/sms/reservation`,
  );

  return response;
};

// 메시지 발송 예약 삭제
export const deleteSurveySmsReservation = async ({
  aptUuid,
  surveyUuid,
  reservationUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/survey/${surveyUuid}/sms/reservation/${reservationUuid}`,
  );

  return response;
};
