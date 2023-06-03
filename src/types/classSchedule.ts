import { DayOfWeek } from './dayOfWeek';
import { GenericStatus } from './genericStatus';

export interface CreateClassScheduleRequestData {
  classNumber: number;
  shiftGuid: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ClassSchedule extends CreateClassScheduleRequestData {
  guid?: string;
  status: GenericStatus;
}
