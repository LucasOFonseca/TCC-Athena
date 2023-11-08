export enum GradeItemType {
  sum = 'sum',
  average = 'average',
}

export interface GradeItem {
  guid?: string;
  name: string;
  type: GradeItemType;
  maxValue: number;
}

export interface DisciplineGradeConfig {
  guid?: string;
  gradeItems: GradeItem[];
}
