import {
  ClassSchedule,
  CreateClassScheduleRequestData,
} from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { SuccessMessages } from '@athena-types/messages';
import Api from './api';

const baseUrl = '/class-schedule';

async function create(data: CreateClassScheduleRequestData[]): Promise<void> {
  return Api.post(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS03 },
  }).then();
}

async function update(data: ClassSchedule[]): Promise<void> {
  return Api.put(baseUrl, data, {
    headers: { authHeader: true, 'success-message': SuccessMessages.MSGS02 },
  }).then();
}

async function changeStatus(
  guid: string,
  status: GenericStatus
): Promise<void> {
  return Api.patch(
    `${baseUrl}/${guid}`,
    { status },
    { headers: { authHeader: true, 'success-message': SuccessMessages.MSGS04 } }
  ).then();
}

export const classScheduleService = { create, update, changeStatus };
