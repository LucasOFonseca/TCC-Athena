import { Dayjs } from 'dayjs';

export interface StudentAbsence {
  guid?: string;
  studentGuid: string;
  studentName: string;
  totalPresences?: number;
  totalAbsences: number;
}

export interface AttendanceLog {
  guid?: string;
  periodGuid: string;
  disciplineGuid: string;
  classDate: string;
  totalClasses: number;
  classSummary: string;
  studentAbsences: StudentAbsence[];
}

export interface AttendanceLogForm
  extends Omit<AttendanceLog, 'guid' | 'classDate'> {
  classDate: Dayjs;
}

export interface SimplifiedAttendanceLog {
  guid: string;
  classDate: string;
  classSummary: string;
}
