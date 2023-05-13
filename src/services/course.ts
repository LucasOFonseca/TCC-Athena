import { Course, CreateCourseRequestData } from '@athena-types/course';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@athena-types/paginatedData';
import Api from './api';

const baseUrl = '/course';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Course>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreateCourseRequestData): Promise<Course> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: Course): Promise<Course> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Course> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

export const courseService = { getPaginated, create, update, changeStatus };
