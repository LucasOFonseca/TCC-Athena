import { GenericStatus } from './genericStatus';

export interface CreateCourseRequestData {
  name: string;
  minPassingGrade: number;
}

export interface Course extends CreateCourseRequestData {
  guid?: string;
  status: GenericStatus;
}
