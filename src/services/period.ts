import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { SuccessMessages } from '@athena-types/messages';
import {
  CreatePeriodRequestData,
  PaginatedPeriodsRequestParams,
  PaginatedPeriodsResponse,
  Period,
  PeriodStatus,
  SimplifiedPeriod,
} from '@athena-types/period';
import { StudentEnrollment } from '@athena-types/studentEnrollment';
import { StudentGrade } from '@athena-types/sudentGade';
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

async function getSimplified(guid: string): Promise<SimplifiedPeriod> {
  return Api.get(`${baseUrl}/${guid}/simplified`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
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

async function updateDisciplineGradeConfig(
  periodGuid: string,
  disciplineGuid: string,
  data: DisciplineGradeConfig
): Promise<DisciplineGradeConfig> {
  return Api.put(
    `${baseUrl}/${periodGuid}/disciplines/${disciplineGuid}/grade-config`,
    data,
    {
      headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
    }
  ).then((res) => res.data);
}

async function getDisciplineGradeConfig(
  periodGuid: string,
  disciplineGuid: string
): Promise<DisciplineGradeConfig> {
  return Api.get(
    `${baseUrl}/${periodGuid}/disciplines/${disciplineGuid}/grade-config`,
    {
      headers: { authHeader: true },
    }
  ).then((res) => res.data);
}

async function updateStudentsGrades(
  periodGuid: string,
  disciplineGuid: string,
  data: StudentGrade[]
): Promise<StudentGrade[]> {
  return Api.put(
    `${baseUrl}/${periodGuid}/disciplines/${disciplineGuid}/grades`,
    data,
    {
      headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
    }
  ).then((res) => res.data);
}

async function getStudentsGrades(
  periodGuid: string,
  disciplineGuid: string
): Promise<StudentGrade[]> {
  return Api.get(
    `${baseUrl}/${periodGuid}/disciplines/${disciplineGuid}/grades`,
    {
      headers: { authHeader: true },
    }
  ).then((res) => res.data);
}

export const periodService = {
  getPaginated,
  getByGuid,
  getSimplified,
  create,
  update,
  cancel,
  enrollStudents,
  getEnrollments,
  cancelEnrollment,
  updateDisciplineGradeConfig,
  getDisciplineGradeConfig,
  updateStudentsGrades,
  getStudentsGrades,
};
