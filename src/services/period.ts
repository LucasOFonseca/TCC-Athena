import { SuccessMessages } from '@athena-types/messages';
import {
  CreatePeriodRequestData,
  PaginatedPeriodsRequestParams,
  PaginatedPeriodsResponse,
  Period,
  PeriodStatus,
} from '@athena-types/period';
import { StudentEnrollment } from '@athena-types/studentEnrollment';
import Api from './api';

const baseUrl = '/period';

async function getPaginated(
  params?: PaginatedPeriodsRequestParams
): Promise<PaginatedPeriodsResponse> {
  return Api.get(baseUrl, { params, headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function getByGuid(guid: string): Promise<Period> {
  return Api.get(`${baseUrl}/${guid}`, { headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: CreatePeriodRequestData): Promise<Period> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: Period): Promise<Period> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

async function cancel(guid: string): Promise<Period> {
  return Api.patch(
    `${baseUrl}/${guid}/cancel`,
    { status: PeriodStatus.canceled },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

async function enrollStudents(
  guid: string,
  students: string[]
): Promise<StudentEnrollment[]> {
  return Api.post(`${baseUrl}/${guid}/enroll`, students, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS01 },
  }).then((res) => res.data);
}

async function getEnrollments(guid: string): Promise<StudentEnrollment[]> {
  return Api.get(`${baseUrl}/${guid}/enrollments`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function cancelEnrollment(
  periodGuid: string,
  enrollmentGuid: string
): Promise<void> {
  return Api.delete(`${baseUrl}/${periodGuid}/enrollments/${enrollmentGuid}`, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS05 },
  }).then();
}

export const periodService = {
  getPaginated,
  getByGuid,
  create,
  update,
  cancel,
  enrollStudents,
  getEnrollments,
  cancelEnrollment,
};
