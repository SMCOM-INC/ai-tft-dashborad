import { auth } from '@/apis/axios.js';

// ///////////////////////////////////////////////////////
// ///////////////////////// 공통 ////////////////////////
// ///////////////////////////////////////////////////////

// 투표 삭제
export const deleteVote = async ({ aptUuid, voteUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}`,
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 투표 리스트 /////////////////////
// ///////////////////////////////////////////////////////

// 그룹 생성
export const postVoteGroup = async ({ aptUuid, groupName }) => {
  const response = await auth.post(`/board/apt-admin/vote/${aptUuid}/group`, {
    title: groupName,
  });

  return response;
};

// 그룹 수정
export const patchVoteGroup = async ({ aptUuid, groupUuid, groupName }) => {
  const response = await auth.patch(
    `/board/apt-admin/vote/${aptUuid}/group/${groupUuid}`,
    { title: groupName },
  );

  return response;
};

// 그룹 삭제
export const deleteVoteGroup = async ({ aptUuid, groupUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/vote/${aptUuid}/group/${groupUuid}`,
  );

  return response;
};

// 투표 리스트 조회 및 검색
export const getVoteList = async ({ aptUuid, searchType, keyword }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/group/list`,
    {
      params: { searchType, keyword },
    },
  );

  return response;
};

// 투표 생성
export const postVote = async ({ aptUuid, groupUuid, title, voteType }) => {
  const response = await auth.post(
    `/board/apt-admin/vote/${aptUuid}/${groupUuid}`,
    {
      title,
      voteType,
    },
  );

  return response;
};

// 투표제목 수정
export const patchVoteTitle = async ({ aptUuid, voteUuid, title }) => {
  const response = await auth.patch(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/title`,
    { title },
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 투표 등록 ///////////////////////
// ///////////////////////////////////////////////////////

// 상세조회 폼(미완성 조회)
export const getVoteFormDetail = async ({ aptUuid, voteUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/unfinish`,
  );

  return response;
};

// 기본정보 저장 및 수정
export const patchVoteFormDefault = async ({
  aptUuid,
  voteUuid,
  title,
  voteType,
  voteAuthType,
  content,
  voteManagerName,
  voteManagerPosition,
  imageFileUuidList,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/info`,
    {
      title,
      voteType,
      voteAuthType,
      content,
      voteManagerName,
      voteManagerPosition,
      imageFileUuidList,
    },
  );

  return response;
};

// 참여자리스트 엑셀 샘플 다운로드
export const getVoteFormSampleExcel = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/vote-example/excel`,
    {
      responseType: 'blob',
    },
  );

  return response;
};

// 참여자리스트 엑셀 저장 및 수정
export const postVoteFormExcel = async ({
  aptUuid,
  voteUuid,
  formData,
  onUploadProgress,
}) => {
  const response = await auth.post(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/voter/excel`,
    formData,
    { onUploadProgress },
  );

  return response;
};

// 질문항목 등록
export const postVoteQuestion = async ({
  aptUuid,
  voteUuid,
  questionOptionList,
  content,
  questionType,
  minChoice,
  maxChoice,
}) => {
  const response = await auth.post(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/question`,
    {
      questionOptionList,
      content,
      questionType,
      minChoice,
      maxChoice,
    },
  );

  return response;
};

// 질문항목 수정
export const patchVoteQuestion = async ({
  aptUuid,
  voteUuid,
  questionUuid,
  questionOptionList,
  content,
  questionType,
  minChoice,
  maxChoice,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/question/${questionUuid}`,
    { questionOptionList, content, questionType, minChoice, maxChoice },
  );

  return response;
};

// 질문항목 삭제
export const deleteVoteQuestion = async ({
  aptUuid,
  voteUuid,
  questionUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/question/${questionUuid}`,
  );

  return response;
};

// 투표 제출
export const patchVoteSubmit = async ({
  aptUuid,
  voteUuid,
  openVoteDateTime,
  closeVoteDateTime,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/finish`,
    { openVoteDateTime, closeVoteDateTime },
  );

  return response;
};

// ///////////////////////////////////////////////////////
// ////////////////////// 투표 상세 ///////////////////////
// ///////////////////////////////////////////////////////

// 상세조회 기본
export const getVoteDetailDefault = async ({ aptUuid, voteUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/finish`,
  );

  return response;
};

// 상세조회 참여자 조회
export const getVoteDetailVoters = async ({
  aptUuid,
  voteUuid,
  size,
  page,
  searchType,
  keyword,
  statusSearchType,
}) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/detail`,
    {
      params: {
        size,
        page,
        searchType,
        keyword,
        statusSearchType,
      },
    },
  );

  return response;
};

// 상세조회 참여자 엑셀다운로드
export const getVoteDetailVotersExcel = async ({
  aptUuid,
  voteUuid,
  keyword,
  searchType,
  statusSearchType,
}) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/excel`,
    {
      params: { keyword, searchType, statusSearchType },
      responseType: 'blob',
    },
  );

  return response;
};

// 상세조회 투표 PDF 다운로드
export const getVoteDetailPdf = async ({ aptUuid, voteUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/pdf`,
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
export const postVoteSmsReservation = async ({
  aptUuid,
  voteUuid,
  startDate,
}) => {
  const response = await auth.post(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/kakao/reservation`,
    {
      startDate,
    },
  );

  return response;
};

// 메시지 발송 예약 리스트 조회
export const getVoteSmsReservationList = async ({ aptUuid, voteUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/reservation/list`,
  );

  return response;
};

// 메시지 발송 예약 삭제
export const deleteVoteSmsReservation = async ({
  aptUuid,
  voteUuid,
  reservationUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/vote/${aptUuid}/${voteUuid}/reservation/${reservationUuid}`,
  );

  return response;
};
