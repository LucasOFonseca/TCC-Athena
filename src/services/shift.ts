import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import { Shift } from '@athena-types/shift';
import Api from './api';

const baseUrl = '/shift';

async function getAll(token?: string): Promise<Shift[]> {
  return Api.get(`${baseUrl}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : { authHeader: true },
  }).then((res) => res.data);
}

async function getClassSchedules(
  shiftGuid: string
): Promise<ClassSchedule[][]> {
  return Api.get(`${baseUrl}/${shiftGuid}/class-schedules`, {
    headers: { authHeader: true },
  }).then((res) => res.data);
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<Shift> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then((res) => res.data);
}

export const shiftService = { getAll, getClassSchedules, changeStatus };
