import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getFirstMonth, getLprList } from '@/apis/parking.js';
import {
  patchEditBusinessRegular,
  patchHouseholdRegular,
  patchRegular,
  postBusinessRegular,
  postHouseholdRegular,
  postRegular,
} from '@/apis/parkingRegular.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// LPR
const useFetchAptLprList = (aptUuid, options = {}) => {
  const queryKey = computed(() => ['aptLprList', aptUuid]);

  const {
    data: aptLprList,
    isLoading: isAptLprListLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getLprList(aptUuid),
    select: (data) => {
      const { success } = data.data;
      return [
        ...success.map((lpr) => ({
          uuid: lpr.lprUuid,
          key: lpr.lprUuid,
          label: lpr.lprName,
          checked: true,
        })),
      ];
    },
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

  return { aptLprList, isAptLprListLoading, isError, error };
};

const useFetchInOutHistoryAptLprList = () => {
  const { userInfo } = useUserInfoStore();

  const queryKey = computed(() => ['inOutAptLprList', userInfo.aptUuid]);

  const {
    data: inOutAptLprList,
    isLoading: isinOutAptLprListLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getLprList(userInfo.aptUuid),
    select: (data) => {
      const { success } = data.data;
      return success.reduce(
        (acc, item) => {
          acc[item.lprType].push(item);
          return acc;
        },
        { IN: [], OUT: [] },
      );
    },
  });

  return { inOutAptLprList, isinOutAptLprListLoading, isError, error };
};

// 정기차량 등록 (통합)
const usePostRegular = (type) => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const typeText = type === 'HOUSEHOLD' ? '세대' : '업무';
  const queryKeyPrefix = type === 'HOUSEHOLD' ? 'household' : 'business';

  const {
    mutate: postRegularMutation,
    isPending: isPostRegularPending,
    isSuccess: isPostRegularSuccess,
  } = useMutation({
    mutationFn: (params) => {
      return postRegular({ ...params, aptUuid: userInfo.aptUuid }, type);
    },
    onSuccess: () => {
      swalSuccessModal({
        title: `${typeText} 정기차량이 등록되었습니다.`,
      });

      queryClient.invalidateQueries([
        `${queryKeyPrefix}RegularCarList`,
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || `${typeText} 정기차량 등록에 실패했습니다.`,
      });
    },
  });

  return {
    postRegularMutation,
    isPostRegularPending,
    isPostRegularSuccess,
  };
};

// 정기차량 등록 : 세대
const usePostHouseholdRegular = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: postHouseholdRegularMutation,
    isPending: isPostHouseholdRegularPending,
    isSuccess: isPostHouseholdRegularSuccess,
  } = useMutation({
    mutationFn: ({
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      regularCarType,
      dong,
      ho,
      parkingWallPadAlarm,
    }) => {
      return postHouseholdRegular({
        aptUuid: userInfo.aptUuid,
        registType: 'HOUSEHOLD',
        carNum,
        phone,
        name,
        startDate,
        endDate,
        memo,
        regularCarType,
        dong,
        ho,
        notificationFlag: parkingWallPadAlarm,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '세대 정기차량이 등록되었습니다.',
      });

      queryClient.invalidateQueries([
        'householdRegularCarList',
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '세대 정기차량 등록에 실패했습니다.',
      });
    },
  });

  return {
    postHouseholdRegularMutation,
    isPostHouseholdRegularPending,
    isPostHouseholdRegularSuccess,
  };
};

// 정기차량 등록 : 업무
const usePostBusinessRegular = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: postBusinessRegularMutation,
    isPending: isPostBusinessRegularPending,
    isSuccess: isPostBusinessRegularSuccess,
  } = useMutation({
    mutationFn: ({
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      businessTypeUuid,
    }) => {
      return postBusinessRegular({
        aptUuid: userInfo.aptUuid,
        registType: 'BUSINESS',
        carNum,
        phone,
        name,
        startDate,
        endDate,
        memo,
        businessTypeUuid,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '업무 정기차량이 등록되었습니다.',
      });

      queryClient.invalidateQueries([
        'businessRegularCarList',
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '업무 정기차량 등록에 실패했습니다.',
      });
    },
  });

  return {
    postBusinessRegularMutation,
    isPostBusinessRegularPending,
    isPostBusinessRegularSuccess,
  };
};

// 정기차량 수정 (통합)
const usePatchRegular = (type) => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const typeText = type === 'HOUSEHOLD' ? '세대' : '업무';
  const queryKeyPrefix = type === 'HOUSEHOLD' ? 'household' : 'business';

  const {
    mutate: patchRegularMutation,
    isPending: isPatchRegularPending,
    isSuccess: isPatchRegularSuccess,
  } = useMutation({
    mutationFn: (params) => {
      return patchRegular({ ...params, aptUuid: userInfo.aptUuid }, type);
    },
    onSuccess: () => {
      swalSuccessModal({
        title: `${typeText} 정기차량이 수정되었습니다.`,
      });

      queryClient.invalidateQueries([
        `${queryKeyPrefix}RegularCarList`,
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || `${typeText} 정기차량 수정에 실패했습니다.`,
      });
    },
  });

  return {
    patchRegularMutation,
    isPatchRegularPending,
    isPatchRegularSuccess,
  };
};

// 정기차량 수정 : 세대
const usePatchHouseholdRegularCar = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: patchHouseholdRegularCarMutation,
    isPending: isPatchHouseholdRegularCarPending,
    isSuccess: isPatchHouseholdRegularCarSuccess,
  } = useMutation({
    mutationFn: ({
      uuid,
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      regularCarType,
      dong,
      ho,
      parkingWallPadAlarm,
    }) => {
      return patchHouseholdRegular({
        aptUuid: userInfo.aptUuid,
        uuid,
        registType: 'HOUSEHOLD',
        carNum,
        phone,
        name,
        startDate,
        endDate,
        memo,
        regularCarType,
        dong,
        ho,
        notificationFlag: parkingWallPadAlarm,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '세대 정기차량이 수정되었습니다.',
      });

      queryClient.invalidateQueries([
        'householdRegularCarList',
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '세대 정기차량 수정에 실패했습니다.',
      });
    },
  });

  return {
    patchHouseholdRegularCarMutation,
    isPatchHouseholdRegularCarPending,
    isPatchHouseholdRegularCarSuccess,
  };
};

// 정기차량 수정 : 업무
const usePatchBusinessRegularCar = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: patchBusinessRegularCarMutation,
    isPending: isPatchBusinessRegularCarPending,
    isSuccess: isPatchBusinessRegularCarSuccess,
  } = useMutation({
    mutationFn: ({
      uuid,
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      businessTypeUuid,
    }) => {
      return patchEditBusinessRegular({
        aptUuid: userInfo.aptUuid,
        uuid,
        registType: 'BUSINESS',
        carNum,
        phone,
        name,
        startDate,
        endDate,
        memo,
        businessTypeUuid,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '업무 정기차량이 수정되었습니다.',
      });

      queryClient.invalidateQueries([
        'businessRegularCarList',
        userInfo.aptUuid,
      ]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '업무 정기차량 수정에 실패했습니다.',
      });
    },
  });

  return {
    patchBusinessRegularCarMutation,
    isPatchBusinessRegularCarPending,
    isPatchBusinessRegularCarSuccess,
  };
};

const useGetFirstMonth = () => {
  const { userInfo } = useUserInfoStore();
  const queryKey = computed(() => ['firstMonth', userInfo.aptUuid]);

  const {
    data: parkStartDate,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getFirstMonth(userInfo.aptUuid),
    select: (data) => {
      const { success } = data.data;
      return success.yearMonth;
    },
  });

  return { parkStartDate, isLoading, isError, error };
};

export {
  // 기존 함수들 (호환성 유지)
  usePostBusinessRegular,
  usePostHouseholdRegular,
  usePatchHouseholdRegularCar,
  usePatchBusinessRegularCar,
  usePostRegular,
  usePatchRegular,

  // LPR 관련
  useFetchAptLprList,
  useFetchInOutHistoryAptLprList,

  // 기타
  useGetFirstMonth,
};
