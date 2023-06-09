import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@athena-types/paginatedData';
import { CreateStudentRequestData, Student } from '@athena-types/student';
import Api from './api';

const baseUrl = '/student';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Student>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreateStudentRequestData): Promise<Student> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
  }).then((res) => res.data);
}

async function update(data: Student): Promise<Student> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Student> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

async function resetPassword(guid: string): Promise<Student> {
  return Api.put(
    `${baseUrl}/${guid}/reset-password`,
    {},
    {
      headers: { authHeader: true, 'success-message': SuccessMessages.MSGS06 },
    }
  ).then((res) => res.data);
}

export const studentService = {
  getPaginated,
  create,
  update,
  changeStatus,
  resetPassword,
};
