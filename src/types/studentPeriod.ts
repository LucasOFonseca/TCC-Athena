import { FilterItem } from './filterItem';
import { PeriodStatus } from './period';

export enum StudentGradeStatus {
  pass = 'pass',
  fail = 'fail',
  pending = 'pending',
}

interface StudentPeriodBase {
  guid: string;
  deadline?: string;
}

export interface StudentPeriod extends StudentPeriodBase {
  status: PeriodStatus;
  name: string;
  disciplines: FilterItem[];
}

export interface StudentPeriodDisciplineGrade {
  guid: string;
  name: string;
  value: number;
}

export interface StudentPeriodDiscipline {
  guid: string;
  name: string;
  status: StudentGradeStatus;
  totalAbsences: number;
  finalGrade: number;
  grades: StudentPeriodDisciplineGrade[];
}

export interface StudentPeriodModule {
  guid: string;
  name: string;
  disciplines: StudentPeriodDiscipline[];
}

export interface StudentPeriodDetails extends StudentPeriodBase {
  classId: string;
  course: string;
  matrix: string;
  currentModuleName: string;
  classesStartDate: string;
  enrollmentNumber: string;
  modules: StudentPeriodModule[];
}

export interface StudentPeriodMatrixModuleDiscipline {
  guid: string;
  name: string;
  workload: number;
  syllabus: string;
}

export interface StudentPeriodMatrixModule {
  guid: string;
  name: string;
  disciplines: StudentPeriodMatrixModuleDiscipline[];
}

export interface StudentPeriodMatrix {
  course: string;
  name: string;
  totalWorkload: number;
  modules: StudentPeriodMatrixModule[];
}
