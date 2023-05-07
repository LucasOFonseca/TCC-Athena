import axios from 'axios';
import { authInterceptor } from '../interceptors/authInterceptor';
import { errorInterceptor } from '../interceptors/errorInterceptor';
import { successMessageInterceptor } from '../interceptors/successMessageInterceptor';

const Api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

Api.interceptors.request.use(authInterceptor);

Api.interceptors.response.use(successMessageInterceptor, errorInterceptor);

export default Api;
