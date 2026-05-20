import axios from 'axios';
import qs from 'qs';

export const aiClient = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});
