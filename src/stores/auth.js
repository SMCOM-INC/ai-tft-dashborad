import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useTokenStore = defineStore('token', () => {
  // useLocalStorage를 통해 상태를 초기화하고 동기화
  const token = useLocalStorage('token', {});

  // 변경
  const setToken = (newValue) => {
    const newData = {
      ...token.value,
      ...newValue,
    };
    token.value = newData;
  };

  // 초기화
  const resetToken = () => {
    token.value = {};
  };

  return { token, setToken, resetToken };
});

export const useUserInfoStore = defineStore('userInfo', () => {
  // useLocalStorage를 통해 상태를 초기화하고 동기화
  const userInfo = useLocalStorage('userInfo', {
    aptName: '단지를 선택해주세요',
    aptUuid: null,
    aptId: null,
  });

  // 변경
  const setUserInfo = (newValue) => {
    const newData = {
      ...userInfo.value,
      ...newValue,
    };
    userInfo.value = newData;
  };

  // 초기화
  const resetUserInfo = () => {
    userInfo.value = {};
  };

  return { userInfo, setUserInfo, resetUserInfo };
});
