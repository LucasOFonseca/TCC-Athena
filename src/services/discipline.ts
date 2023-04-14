import { Discipline } from '@athena-types/discipline';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@athena-types/paginatedData';
import Api from './api';

const baseUrl = '/discipline';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Discipline>> {
  return Api.get(baseUrl, { params }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Discipline> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { 'success-message': SuccessMessages.statusChanged } }
  ).then((res) => res.data);
}

export const disciplineService = { getPaginated, changeStatus };
