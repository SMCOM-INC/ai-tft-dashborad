import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import _ from 'lodash';
import { computed } from 'vue';

import {
  deleteMoveHouseHoliday,
  getMoveHouseHolidayList,
  getMoveHouseReservationDay,
  getMoveHouseReservationDetail,
  getMoveHouseReservationMonth,
  getMoveHouseSetting,
  patchMoveHouseReservationCancel,
  patchMoveHouseReservationConfirm,
  postCreateMoveHouseReservation,
  postMoveHouseHoliday,
  putMoveHouseSetting,
} from '@/apis/moving.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

// 이사 설정 수정
const useUpdateMoveHouseSetting = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateMoveHouseSettingMutation,
    isLoading: isUpdateMoveHouseSettingLoading,
    isError: isUpdateMoveHouseSettingError,
    error: updateMoveHouseSettingError,
  } = useMutation({
    mutationFn: (data) => {
      // moveReservationTimeList를 startTime 기준으로 오름차순 정렬
      const timeList = _.get(data, 'moveReservationTimeList', []);
      const sortedTimeList = _.sortBy(timeList, ['startTime']);

      const sortedData = {
        ...data,
        moveReservationTimeList: sortedTimeList,
      };

      return putMoveHouseSetting({ aptUuid, data: sortedData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moveHouseSetting', aptUuid],
      });
    },
  });

  return {
    updateMoveHouseSettingMutation,
    isUpdateMoveHouseSettingLoading,
    isUpdateMoveHouseSettingError,
    updateMoveHouseSettingError,
  };
};

// 이사 설정 조회
const useFetchMoveHouseSetting = (aptUuid) => {
  const {
    data: moveHouseSetting,
    isLoading: isMoveHouseSettingLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['moveHouseSetting', aptUuid],
    queryFn: () => getMoveHouseSetting({ aptUuid }),
    select: (data) => {
      const success = _.get(data, 'data.success');
      if (success) {
        return success;
      }
      return {
        isBlank: true,
        moveReservationPrice: 0,
        depositBank: '',
        depositAccountHolder: '',
        depositAccount: '',
        moveReservationText: '',
        useFlag: true,
        moveReservationTimeList: [],
      };
    },
  });

  return {
    moveHouseSetting,
    isMoveHouseSettingLoading,
    isError,
    error,
  };
};

// 이사 예약 시간 리스트 조회 (사용중인 것만)
const useFetchMoveHouseReservationTimeList = (aptUuid) => {
  const {
    data: moveHouseReservationTimeList,
    isLoading: isMoveHouseReservationTimeListLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['moveHouseSetting', aptUuid],
    queryFn: () => getMoveHouseSetting({ aptUuid }),
    select: (data) => {
      const success = _.get(data, 'data.success');
      if (success) {
        const timeList = _.get(success, 'moveReservationTimeList', []);
        return _.filter(timeList, { useFlag: true });
      }
      return [];
    },
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });

  return {
    moveHouseReservationTimeList,
    isMoveHouseReservationTimeListLoading,
    isError,
    error,
    refetch,
  };
};

// 이사 휴무일 추가
const useAddMoveHouseHoliday = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: addMoveHouseHolidayMutation,
    isPending: isAddMoveHouseHolidayPending,
    isError: isAddMoveHouseHolidayError,
    error: addMoveHouseHolidayError,
  } = useMutation({
    mutationFn: (data) => postMoveHouseHoliday({ aptUuid, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moveHouseHolidayList', aptUuid],
      });
      swalSuccessModal({
        title: '이사 휴무일이 등록되었습니다.',
      });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({
            text: message || '이사 휴무일 등록에 실패했습니다.',
          });
      }
    },
  });

  return {
    addMoveHouseHolidayMutation,
    isAddMoveHouseHolidayPending,
    isAddMoveHouseHolidayError,
    addMoveHouseHolidayError,
  };
};

// 이사 휴무일 리스트 조회
const useFetchMoveHouseHolidayList = (aptUuid) => {
  const {
    data: moveHouseHolidayList,
    isLoading: isMoveHouseHolidayListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['moveHouseHolidayList', aptUuid],
    queryFn: () => getMoveHouseHolidayList({ aptUuid }),
    select: (data) => data.data.success,
  });

  return {
    moveHouseHolidayList,
    isMoveHouseHolidayListLoading,
    isError,
    error,
  };
};

// 이사 휴무일 삭제
const useDeleteMoveHouseHoliday = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteMoveHouseHolidayMutation,
    isLoading: isDeleteMoveHouseHolidayLoading,
    isError: isDeleteMoveHouseHolidayError,
    error: deleteMoveHouseHolidayError,
  } = useMutation({
    mutationFn: (moveHouseHolidayUuid) =>
      deleteMoveHouseHoliday({ aptUuid, uuid: moveHouseHolidayUuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moveHouseHolidayList', aptUuid],
      });
      swalSuccessModal({
        title: '이사 휴무일이 삭제되었습니다.',
      });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({
            text: message || '이사 휴무일 삭제에 실패했습니다.',
          });
      }
    },
  });

  return {
    deleteMoveHouseHolidayMutation,
    isDeleteMoveHouseHolidayLoading,
    isDeleteMoveHouseHolidayError,
    deleteMoveHouseHolidayError,
  };
};

// 이사 예약 월별 조회
const useFetchMoveHouseReservationMonth = (aptUuid, yearMonth) => {
  const queryKey = computed(() => [
    'moveHouseReservationMonth',
    aptUuid,
    yearMonth.value,
  ]);

  const {
    data: moveHouseReservationMonth,
    isLoading: isMoveHouseReservationMonthLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getMoveHouseReservationMonth({
        aptUuid,
        yearMonth: yearMonth.value,
      }),
    select: (data) => data.data.success,
    enabled: !!aptUuid && !!yearMonth.value,
  });

  return {
    moveHouseReservationMonth,
    isMoveHouseReservationMonthLoading,
    isError,
    error,
  };
};

// 이사 예약 일별 조회
const useFetchMoveHouseReservationDay = (aptUuid, moveDate) => {
  const queryKey = computed(() => [
    'moveHouseReservationDay',
    aptUuid,
    moveDate.value,
  ]);

  const {
    data: moveHouseReservationDay,
    isLoading: isMoveHouseReservationDayLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getMoveHouseReservationDay({
        aptUuid,
        moveDate: moveDate.value,
      }),
    select: (data) => data.data.success,
    enabled: !!aptUuid && !!moveDate.value,
  });

  return {
    moveHouseReservationDay,
    isMoveHouseReservationDayLoading,
    isError,
    error,
  };
};

// 이사 예약 생성
const useCreateMoveHouseReservation = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createMoveHouseReservationMutation,
    isPending: isCreateMoveHouseReservationPending,
    isError: isCreateMoveHouseReservationError,
  } = useMutation({
    mutationFn: (data) => postCreateMoveHouseReservation({ aptUuid, data }),
    onSuccess: () => {
      // 월별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationMonth', aptUuid],
      });
      // 일별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationDay', aptUuid],
      });
      swalSuccessModal({
        title: '이사 예약이 등록되었습니다.',
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
    createMoveHouseReservationMutation,
    isCreateMoveHouseReservationPending,
    isCreateMoveHouseReservationError,
  };
};

// 이사 예약 상세 조회
const useFetchMoveHouseReservationDetail = (
  aptUuid,
  moveHouseReservationUuid,
) => {
  const queryKey = computed(() => [
    'moveHouseReservationDetail',
    aptUuid,
    moveHouseReservationUuid.value,
  ]);

  const {
    data: moveHouseReservationDetail,
    isLoading: isMoveHouseReservationDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getMoveHouseReservationDetail({
        aptUuid,
        moveReservationUuid: moveHouseReservationUuid.value,
      }),
    select: (data) => data.data.success,
    enabled: !!aptUuid && !!moveHouseReservationUuid.value,
  });

  return {
    moveHouseReservationDetail,
    isMoveHouseReservationDetailLoading,
    isError,
    error,
  };
};

// 이사 예약 확정
const useConfirmMoveHouseReservation = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: confirmMoveHouseReservationMutation,
    isLoading: isConfirmMoveHouseReservationLoading,
    isError,
  } = useMutation({
    mutationFn: ({ moveHouseReservationUuid, data }) =>
      patchMoveHouseReservationConfirm({
        aptUuid,
        moveReservationUuid: moveHouseReservationUuid,
        data,
      }),
    onSuccess: (_response, { moveHouseReservationUuid }) => {
      queryClient.invalidateQueries({
        queryKey: [
          'moveHouseReservationDetail',
          aptUuid,
          moveHouseReservationUuid,
        ],
      });
      // 캘린더 월별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationMonth', aptUuid],
      });
      // 캘린더 일별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationDay', aptUuid],
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
    confirmMoveHouseReservationMutation,
    isConfirmMoveHouseReservationLoading,
    isError,
  };
};

// 이사 예약 취소
const useCancelMoveHouseReservation = (aptUuid, moveHouseReservationUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: cancelMoveHouseReservationMutation,
    isLoading: isCancelMoveHouseReservationLoading,
    isError,
  } = useMutation({
    mutationFn: (data) =>
      patchMoveHouseReservationCancel({
        aptUuid,
        moveReservationUuid: moveHouseReservationUuid,
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'moveHouseReservationDetail',
          aptUuid,
          moveHouseReservationUuid,
        ],
      });
      // 캘린더 월별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationMonth', aptUuid],
      });
      // 캘린더 일별 조회 쿼리 초기화
      queryClient.invalidateQueries({
        queryKey: ['moveHouseReservationDay', aptUuid],
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
    cancelMoveHouseReservationMutation,
    isCancelMoveHouseReservationLoading,
    isError,
  };
};

export {
  useUpdateMoveHouseSetting,
  useFetchMoveHouseSetting,
  useFetchMoveHouseReservationTimeList,
  useAddMoveHouseHoliday,
  useFetchMoveHouseHolidayList,
  useDeleteMoveHouseHoliday,
  useFetchMoveHouseReservationMonth,
  useFetchMoveHouseReservationDay,
  useCreateMoveHouseReservation,
  useFetchMoveHouseReservationDetail,
  useConfirmMoveHouseReservation,
  useCancelMoveHouseReservation,
};
