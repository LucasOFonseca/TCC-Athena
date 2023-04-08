import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../types';

export function errorInterceptor(error: any) {
  const res = error.response as AxiosResponse;

  if (res && res.data.message) {
    toast.error(res.data.message);
  } else {
    toast.error(ErrorMessages.unknown);
  }

  return Promise.reject(error);
}
