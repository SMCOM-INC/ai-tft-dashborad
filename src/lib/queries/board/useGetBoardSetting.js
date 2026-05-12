import { useQuery } from '@tanstack/vue-query';

import { getBoardSetting } from '@/apis/board.js';

const useGetBoardSetting = (aptUuid) => {
  const {
    data: boardSettingDetail,
    isLoading: isBoardSettingDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['boardSettingDetail', aptUuid],
    queryFn: () => getBoardSetting(aptUuid),
    select: (data) => data.data.success,
  });

  return { boardSettingDetail, isBoardSettingDetailLoading, isError, error };
};

export default useGetBoardSetting;
