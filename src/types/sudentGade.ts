import { GradeItemType } from './disciplineGradeConfig';

export interface StudentGradeItem {
  guid?: string;
  gradeItemGuid: string;
  type: GradeItemType;
  name?: string;
  value: number;
  maxValue: number;
}

export interface StudentGrade {
  guid?: string;
  finalValue: number;
  studentGuid: string;
  studentName: string;
  gradeItems: StudentGradeItem[];
}
