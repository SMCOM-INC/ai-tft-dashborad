import { auth } from '@/apis/axios.js';

// 항상허용 리스트 조회
export const getAlwaysAllowList = async ({
  aptUuid,
  searchType,
  keyword,
  size,
  page,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/always-allow`,
    {
      params: { searchType, keyword, size, page },
    },
  );

  return response;
};

// 항상허용 등록
export const postAlwaysAllow = async ({
  aptUuid,
  carNum,
  dong,
  ho,
  phone,
  visitPurposeUuid,
  memo,
  notificationFlag,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/always-allow`,
    {
      carNum,
      dong,
      ho,
      phone,
      visitPurposeUuid,
      memo,
      notificationFlag,
    },
  );

  return response;
};

// 항상허용 삭제
export const deleteAlwaysAllow = async ({ aptUuid, alwaysAllowUuidList }) => {
  const response = await auth.delete(
    `/parking/apt-admin/${aptUuid}/always-allow`,
    {
      params: {
        alwaysAllowUuidList,
      },
    },
  );

  return response;
};
