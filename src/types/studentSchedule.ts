import { DayOfWeek } from './dayOfWeek';

export interface StudentSchedule {
  guid: string;
  course: string;
  classNumber: number;
  classroom: string;
  discipline: string;
  educator: string;
  startTime: string;
  endTime: string;
}

export interface SchedulesByDayOfWeek {
  dayOfWeek: DayOfWeek;
  schedules: StudentSchedule[];
}

export interface SchedulesByShift {
  morning?: SchedulesByDayOfWeek[];
  afternoon?: SchedulesByDayOfWeek[];
  evening?: SchedulesByDayOfWeek[];
}
