import { GenericStatus } from './genericStatus';

export interface CreateDisciplineRequestData {
  name: string;
  syllabus: string;
  workload: number;
  weeklyClasses: number;
}

export interface Discipline extends CreateDisciplineRequestData {
  guid?: string;
  status: GenericStatus;
}
