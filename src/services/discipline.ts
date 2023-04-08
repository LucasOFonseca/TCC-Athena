import {
  Discipline,
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '../types';
import Api from './api';

const baseUrl = '/discipline';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Discipline>> {
  return Api.get(baseUrl, { params }).then((res) => res.data);
}

export const disciplineService = { getPaginated };
