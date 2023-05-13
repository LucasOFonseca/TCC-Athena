import { GenericStatus } from './genericStatus';

export interface CreateCourseRequestData {
  name: string;
}

export interface Course extends CreateCourseRequestData {
  guid?: string;
  status: GenericStatus;
}
