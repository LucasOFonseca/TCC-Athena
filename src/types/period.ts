import { Dayjs } from 'dayjs';
import { ClassSchedule } from './classSchedule';
import { PaginatedDataResponse, PaginatedRequestParams } from './paginatedData';

export enum PeriodStatus {
  draft = 'draft',
  notStarted = 'notStarted',
  openForEnrollment = 'openForEnrollment',
  inProgress = 'inProgress',
  finished = 'finished',
  canceled = 'canceled',
}

export interface DisciplineSchedule {
  guid?: string;
  employeeGuid: string;
  employeeName: string;
  disciplineGuid: string;
  disciplineName: string;
  schedules: ClassSchedule[];
}

export interface Period {
  guid: string;
  status: PeriodStatus;
  matrixGuid: string;
  matrixModuleGuid: string;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  deadline?: string;
  vacancies?: number;
  classroomGuid?: string;
  shiftGuid?: string;
  classId?: string;
  disciplinesSchedule?: DisciplineSchedule[];
}

export interface CreatePeriodRequestData
  extends Omit<Period, 'guid' | 'status' | 'matrixGuid'> {
  status?: PeriodStatus;
}

export interface PeriodForm
  extends Omit<
    CreatePeriodRequestData,
    'enrollmentStartDate' | 'enrollmentEndDate' | 'deadline'
  > {
  guid?: string;
  matrixGuid: string;
  enrollmentStartDate?: Dayjs;
  enrollmentEndDate?: Dayjs;
  deadline?: Dayjs;
}

export interface SimplifiedDisciplineSchedule {
  guid: string;
  name: string;
  educator: string;
  schedules: ClassSchedule[];
}

export interface SimplifiedPeriod {
  guid: string;
  status: PeriodStatus;
  name: string;
  enrollmentStartDate?: string;
  disciplinesSchedule?: SimplifiedDisciplineSchedule[];
}

export interface PaginatedPeriodsRequestParams
  extends Omit<PaginatedRequestParams, 'filterByStatus'> {
  filterByStatus?: PeriodStatus;
}

export interface PaginatedPeriodsResponse
  extends Omit<PaginatedDataResponse<SimplifiedPeriod>, 'filterByStatus'> {
  filterByStatus?: PeriodStatus;
}
