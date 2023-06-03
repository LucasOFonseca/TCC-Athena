import { GenericStatus } from './genericStatus';

export enum ShiftType {
  morning = 'morning',
  afternoon = 'afternoon',
  evening = 'evening',
}

export interface Shift {
  guid: string;
  status: GenericStatus;
  shift: ShiftType;
}
