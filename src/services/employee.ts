import {
  CreateEmployeeRequestData,
  Employee,
  EmployeePaginatedRequestParams,
} from '@athena-types/employee';
import { EmployeePeriod } from '@athena-types/employeePeriod';
import { FilterItem } from '@athena-types/filterItem';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import { PaginatedDataResponse } from '@athena-types/paginatedData';
import { DisciplineSchedule } from '@athena-types/period';
import { SchedulesByShift } from '@athena-types/studentSchedule';
import Api from './api';

const baseUrl = '/employee';

async function getPaginated(
  params?: EmployeePaginatedRequestParams
): Promise<PaginatedDataResponse<Employee>> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function getSchedules(guid: string): Promise<DisciplineSchedule[]> {
  return Api.get(`${baseUrl}/${guid}/schedules`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function getEducatorSchedules(guid: string): Promise<SchedulesByShift> {
  return Api.get(`${baseUrl}/${guid}/educator/schedules`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function getPeriods(): Promise<EmployeePeriod[]> {
  return Api.get(`${baseUrl}/periods`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function getDisciplinesByPeriod(
  periodGuid: string
): Promise<FilterItem[]> {
  return Api.get(`${baseUrl}/periods/${periodGuid}/disciplines`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
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
  getSchedules,
  getEducatorSchedules,
  getPeriods,
  getDisciplinesByPeriod,
  create,
  update,
  changeStatus,
  resetPassword,
};
