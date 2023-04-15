import {
  CreateDisciplineRequestData,
  Discipline,
} from '@athena-types/discipline';
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

async function create(data: CreateDisciplineRequestData): Promise<Discipline> {
  return Api.post(baseUrl, data, {
    headers: { 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: Discipline): Promise<Discipline> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Discipline> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

export const disciplineService = { getPaginated, create, update, changeStatus };
