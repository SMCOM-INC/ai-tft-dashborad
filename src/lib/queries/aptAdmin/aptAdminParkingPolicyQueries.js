import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import {
  deleteFreeParkingDate,
  getAptBusinessTypeList,
  getAptHouseholdMileagePolicyCurrentMonth,
  getAptHouseholdMileagePolicyNextMonth,
  getAptVisitPurposeList,
  getBusinessTypeList,
  getFreeParkingDateList,
  getParkingPolicyCurrentMonth,
  getParkingPolicyNextMonth,
  getVisitPurposeList,
  patchBusinessTypeList,
  patchVisitPurposeList,
  postCreateFreeParkingDate,
  postHouseholdMileagePolicyMiddleAdmin,
  postParkingPolicyMiddleAdmin,
  putHouseholdMileagePolicyAptAdmin,
  putParkingPolicyAptAdmin,
} from '@/apis/parking.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useFetchAptVisitPurposeList = (options = {}) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: aptVisitPurposeList,
    isLoading: isAptVisitPurposeListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aptVisitPurposeList', userInfo?.aptUuid, options?.usedOnly],
    queryFn: async () => {
      const allVisitPurposes = await getVisitPurposeList();
      let aptVisitPurposes = [];
      try {
        aptVisitPurposes = await getAptVisitPurposeList(userInfo?.aptUuid);
      } catch (err) {
        return allVisitPurposes.data.success.map((item) => ({
          ...item,
          isUsed: false,
        }));
      }

      if (options?.usedOnly) {
        return aptVisitPurposes.data.success;
      }
      const allVisitPurposeList = allVisitPurposes.data.success.map((item) => ({
        ...item,
        isUsed: aptVisitPurposes.data.success.some(
          (purpose) => purpose.uuid === item.uuid,
        ),
      }));
      return allVisitPurposeList;
    },
    enabled: !!userInfo.aptUuid && options?.enabled,
  });

  return { aptVisitPurposeList, isAptVisitPurposeListLoading, isError, error };
};

const useFetchAptBusinessTypeList = (options = {}) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: aptBusinessTypeList,
    isLoading: isAptBusinessTypeListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aptBusinessTypeList', userInfo?.aptUuid, options?.usedOnly],
    queryFn: async () => {
      const allBusinessTypes = await getBusinessTypeList();
      let aptBusinessTypes = [];
      try {
        const aptBusinessTypesResponse = await getAptBusinessTypeList({
          aptUuid: userInfo?.aptUuid,
        });
        aptBusinessTypes = aptBusinessTypesResponse.data.success;
      } catch (err) {
        return allBusinessTypes.data.success.map((item) => ({
          ...item,
          isUsed: false,
        }));
      }

      if (options?.usedOnly) {
        return aptBusinessTypes;
      }

      const allBusinessTypeList = allBusinessTypes.data.success.map((item) => ({
        ...item,
        isUsed: aptBusinessTypes.some((type) => type.uuid === item.uuid),
      }));
      return allBusinessTypeList;
    },
    enabled: !!userInfo.aptUuid && options?.enabled,
  });

  return { aptBusinessTypeList, isAptBusinessTypeListLoading, isError, error };
};

const useUpdateAptVisitPurposeList = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateAptVisitPurposeListMutation,
    isPending: isUpdateAptVisitPurposeListLoading,
    isError: isUpdateAptVisitPurposeListError,
    error: updateAptVisitPurposeListError,
  } = useMutation({
    mutationFn: (data) => patchVisitPurposeList(aptUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aptVisitPurposeList', aptUuid],
      });
      swalSuccessModal({ text: '방문 목적이 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '방문 목적 수정에 실패했습니다.' });
    },
  });

  return {
    updateAptVisitPurposeListMutation,
    isUpdateAptVisitPurposeListLoading,
    isUpdateAptVisitPurposeListError,
    updateAptVisitPurposeListError,
  };
};

const useUpdateAptBusinessTypeList = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateAptBusinessTypeMutation,
    isPending: isUpdateAptBusinessTypeLoading,
    isError: isUpdateAptBusinessTypeError,
    error: updateAptBusinessTypeError,
  } = useMutation({
    mutationFn: (data) => patchBusinessTypeList(aptUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aptBusinessTypeList', aptUuid],
      });
      swalSuccessModal({ text: '단지 업무 목적이 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '업무 목적 수정에 실패했습니다.' });
    },
  });

  return {
    updateAptBusinessTypeMutation,
    isUpdateAptBusinessTypeLoading,
    isUpdateAptBusinessTypeError,
    updateAptBusinessTypeError,
  };
};

const useFetchMileagePolicyCurrentMonth = (aptUuid) => {
  const {
    data: mileagePolicyCurrentMonth,
    isLoading: isMileagePolicyCurrentMonthLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mileagePolicyCurrentMonth', aptUuid],
    queryFn: () => getAptHouseholdMileagePolicyCurrentMonth(aptUuid),
    select: (data) => {
      if (
        data.data.success === null ||
        data.data.success === undefined ||
        Object.keys(data.data.success).length === 0
      ) {
        return {
          monthBaseMileage: 0,
          hourlyPrice: 0,
          isMileagePolicyBlank: true,
        };
      }
      return data.data.success;
    },
  });

  return {
    mileagePolicyCurrentMonth,
    isMileagePolicyCurrentMonthLoading,
    isError,
    error,
  };
};

const useFetchMileagePolicyNextMonth = (aptUuid) => {
  const {
    data: mileagePolicyNextMonth,
    isLoading: isMileagePolicyNextMonthLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mileagePolicyNextMonth', aptUuid],
    queryFn: () => getAptHouseholdMileagePolicyNextMonth(aptUuid),
    select: (data) => {
      if (
        data.data.success === null ||
        data.data.success === undefined ||
        Object.keys(data.data.success).length === 0
      ) {
        return {
          monthBaseMileage: 0,
          hourlyPrice: 0,
          isMileagePolicyBlank: true,
        };
      }
      return data.data.success;
    },
  });

  return {
    mileagePolicyNextMonth,
    isMileagePolicyNextMonthLoading,
    isError,
    error,
  };
};

const useUpdateMileagePolicy = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateMileagePolicyMutation,
    isPending: isUpdateMileagePolicyLoading,
    isError: isUpdateMileagePolicyError,
    error: updateMileagePolicyError,
  } = useMutation({
    mutationFn: (data) => {
      if (data.month === 'current') {
        return postHouseholdMileagePolicyMiddleAdmin(aptUuid, data);
      }

      if (data.month === 'next') {
        return putHouseholdMileagePolicyAptAdmin(aptUuid, data);
      }
    },
    onSuccess: (_, data) => {
      if (data.month === 'current') {
        queryClient.invalidateQueries({
          queryKey: ['mileagePolicyCurrentMonth', aptUuid],
        });
        swalSuccessModal({ text: '이번달 마일리지 정책이 수정되었습니다.' });
      }

      if (data.month === 'next') {
        queryClient.invalidateQueries({
          queryKey: ['mileagePolicyNextMonth', aptUuid],
        });
        swalSuccessModal({ text: '다음달 마일리지 정책이 수정되었습니다.' });
      }
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '마일리지 정책 수정에 실패했습니다.' });
    },
  });

  return {
    updateMileagePolicyMutation,
    isUpdateMileagePolicyLoading,
    isUpdateMileagePolicyError,
    updateMileagePolicyError,
  };
};

const useFetchParkingPolicyCurrentMonth = (aptUuid) => {
  const {
    data: parkingPolicyCurrentMonth,
    isLoading: isParkingPolicyCurrentMonthLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['parkingPolicyCurrentMonth', aptUuid],
    queryFn: () => getParkingPolicyCurrentMonth(aptUuid),
    select: (data) => {
      if (
        data.data.success === null ||
        data.data.success === undefined ||
        Object.keys(data.data.success).length === 0
      ) {
        return {
          freeParkingMinute: 0,
          freeParkingStartTime: '00:00:00',
          freeParkingEndTime: '00:00:00',
          isFreeParkingTimeBlank: true,
        };
      }
      return data.data.success;
    },
  });

  return {
    parkingPolicyCurrentMonth,
    isParkingPolicyCurrentMonthLoading,
    isError,
    error,
  };
};

const useFetchParkingPolicyNextMonth = (aptUuid) => {
  const {
    data: parkingPolicyNextMonth,
    isLoading: isParkingPolicyNextMonthLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['parkingPolicyNextMonth', aptUuid],
    queryFn: () => getParkingPolicyNextMonth(aptUuid),
    select: (data) => {
      if (
        data.data.success === null ||
        data.data.success === undefined ||
        Object.keys(data.data.success).length === 0
      ) {
        return {
          freeParkingMinute: 0,
          freeParkingStartTime: '00:00:00',
          freeParkingEndTime: '00:00:00',
          isFreeParkingTimeBlank: true,
        };
      }
      return data.data.success;
    },
  });

  return {
    parkingPolicyNextMonth,
    isParkingPolicyNextMonthLoading,
    isError,
    error,
  };
};

const useUpdateParkingPolicy = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateParkingPolicyMutation,
    isPending: isUpdateParkingPolicyLoading,
    isError: isUpdateParkingPolicyError,
    error: updateParkingPolicyError,
  } = useMutation({
    mutationFn: (data) => {
      if (data.month === 'current') {
        return postParkingPolicyMiddleAdmin(aptUuid, data);
      }

      if (data.month === 'next') {
        return putParkingPolicyAptAdmin(aptUuid, data);
      }
    },
    onSuccess: (_, data) => {
      if (data.month === 'current') {
        queryClient.invalidateQueries({
          queryKey: ['parkingPolicyCurrentMonth', aptUuid],
        });
        swalSuccessModal({ text: '이번달 주차설정이 수정되었습니다.' });
      }

      if (data.month === 'next') {
        queryClient.invalidateQueries({
          queryKey: ['parkingPolicyNextMonth', aptUuid],
        });
        swalSuccessModal({ text: '다음달 주차설정이 수정되었습니다.' });
      }
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '주차설정 수정에 실패했습니다.' });
    },
  });

  return {
    updateParkingPolicyMutation,
    isUpdateParkingPolicyLoading,
    isUpdateParkingPolicyError,
    updateParkingPolicyError,
  };
};

// 주차 관리 설정 > 마일리지 미차감 기간 > 조회
const useFetchFreeParkingDateList = () => {
  const { userInfo } = useUserInfoStore();

  const {
    data: freeParkingDateList,
    isLoading: isFreeParkingDateListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['freeParkingDateList', userInfo.aptUuid],
    queryFn: () => getFreeParkingDateList(userInfo.aptUuid),
    select: (data) => data.data.success,
  });

  return { freeParkingDateList, isFreeParkingDateListLoading, isError, error };
};

// 주차 관리 설정 > 마일리지 미차감 기간 > 등록
const usePostFreeParkingDate = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: postFreeParkingDateMutation,
    isPending: isAddFreeParkingDatePending,
    isError: isAddFreeParkingDateError,
    error: addFreeParkingDateError,
  } = useMutation({
    mutationFn: ({ freeParkingStartDate, freeParkingEndDate }) => {
      return postCreateFreeParkingDate({
        aptUuid: userInfo.aptUuid,
        freeParkingStartDate,
        freeParkingEndDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['freeParkingDateList', userInfo.aptUuid],
      });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({
        text: message,
      });
    },
  });

  return {
    postFreeParkingDateMutation,
    isAddFreeParkingDatePending,
    isAddFreeParkingDateError,
    addFreeParkingDateError,
  };
};

// 주차 관리 설정 > 마일리지 미차감 기간 > 삭제
const useDeleteFreeParkingDate = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: deleteFreeParkingDateMutationAsync,
    isLoading: isDeleteFreeParkingDateLoading,
    isError: isDeleteFreeParkingDateError,
    error: deleteFreeParkingDateError,
  } = useMutation({
    mutationFn: (uuid) => {
      return deleteFreeParkingDate(userInfo.aptUuid, uuid);
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '미차감 기간 삭제 성공',
        text: '미차감 기간이 삭제되었습니다.',
      });

      queryClient.invalidateQueries({
        queryKey: ['freeParkingDateList', userInfo.aptUuid],
      });
    },
    onError: () => {
      swalErrorModal({
        title: '미차감 기간 삭제 실패',
        text: '미차감 기간 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    },
  });

  return {
    deleteFreeParkingDateMutationAsync,
    isDeleteFreeParkingDateLoading,
    isDeleteFreeParkingDateError,
    deleteFreeParkingDateError,
  };
};

export {
  useDeleteFreeParkingDate,
  useFetchAptVisitPurposeList,
  useFetchAptBusinessTypeList,
  useUpdateAptBusinessTypeList,
  useUpdateAptVisitPurposeList,
  useFetchMileagePolicyCurrentMonth,
  useFetchMileagePolicyNextMonth,
  useUpdateMileagePolicy,
  useFetchParkingPolicyCurrentMonth,
  useFetchParkingPolicyNextMonth,
  useUpdateParkingPolicy,
  useFetchFreeParkingDateList,
  usePostFreeParkingDate,
};
