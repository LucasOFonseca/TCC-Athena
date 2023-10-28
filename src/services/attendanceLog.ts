import {
  AttendanceLog,
  SimplifiedAttendanceLog,
} from '@athena-types/attendanceLog';
import { SuccessMessages } from '@athena-types/messages';
import { PaginatedDataResponse } from '@athena-types/paginatedData';
import Api from './api';

const baseUrl = '/attendance-log';

async function getByPeriodAndDiscipline(
  periodGuid: string,
  disciplineGuid: string,
  page?: number
): Promise<PaginatedDataResponse<SimplifiedAttendanceLog>> {
  return Api.get(`${baseUrl}/${periodGuid}/${disciplineGuid}`, {
    params: {
      page,
    },
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function getByGuid(guid: string): Promise<AttendanceLog> {
  return Api.get(`${baseUrl}/${guid}`, { headers: { authHeader: true } }).then(
    (res) => res.data
  );
}

async function create(data: AttendanceLog): Promise<AttendanceLog> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then((res) => res.data);
}

async function update(data: AttendanceLog): Promise<AttendanceLog> {
  return Api.put(`${baseUrl}/${data.guid}`, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then((res) => res.data);
}

export const attendanceLogService = {
  getByPeriodAndDiscipline,
  getByGuid,
  create,
  update,
};
