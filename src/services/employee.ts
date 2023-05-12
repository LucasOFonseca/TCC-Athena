import { CreateEmployeeRequestData, Employee } from '@athena-types/employee';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import {
  PaginatedDataResponse,
  PaginatedRequestParams,
} from '@athena-types/paginatedData';
import Api from './api';

const baseUrl = '/employee';

async function getPaginated(
  params?: PaginatedRequestParams
): Promise<PaginatedDataResponse<Employee>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreateEmployeeRequestData): Promise<Employee> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
  }).then((res) => res.data);
}

async function update(data: Employee): Promise<Employee> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Employee> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

async function resetPassword(guid: string): Promise<Employee> {
  return Api.put(
    `${baseUrl}/${guid}/reset-password`,
    {},
    {
      headers: { authHeader: true, 'success-message': SuccessMessages.MSGS06 },
    }
  ).then((res) => res.data);
}

export const employeeService = {
  getPaginated,
  create,
  update,
  changeStatus,
  resetPassword,
};
