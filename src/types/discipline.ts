import { GenericStatus } from '.';

export interface Discipline {
  guid?: string;
  status: GenericStatus;
  name: string;
  syllabus: string;
  workload: number;
}
