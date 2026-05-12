import { client } from '@/apis/axios.js';

// 로그인
export const postLogin = async ({ id, password }) => {
  const response = await client.post('/apartmant/admin/login', {
    id,
    password,
  });
  return response;
};
