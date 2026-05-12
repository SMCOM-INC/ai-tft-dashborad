import { useQuery } from '@tanstack/vue-query';

import { getAptDepartmentContact } from '@/apis/apt.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetAptDepartmentContact = () => {
  const { userInfo } = useUserInfoStore();

  const { data: aptDepartmentDetail, isLoading: isAptDepartmentDetailLoading } =
    useQuery({
      queryKey: ['aptDepartmentContact', userInfo.aptUuid],
      queryFn: () => {
        return getAptDepartmentContact(userInfo.aptUuid);
      },
      select: (data) => {
        return data.data.success;
      },
    });

  return {
    aptDepartmentDetail,
    isAptDepartmentDetailLoading,
  };
};

export default useGetAptDepartmentContact;
