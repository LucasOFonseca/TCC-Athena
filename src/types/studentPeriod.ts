import { FilterItem } from './filterItem';
import { PeriodStatus } from './period';

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
  totalAbsences: number;
  finalGrade: number;
  grades: StudentPeriodDisciplineGrade[];
}

export interface StudentPeriodDetails extends StudentPeriodBase {
  classId: string;
  course: string;
  matrix: string;
  module: string;
  classesStartDate: string;
  enrollmentNumber: string;
  disciplines: StudentPeriodDiscipline[];
}
