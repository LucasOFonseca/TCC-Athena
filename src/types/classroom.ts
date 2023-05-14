import { GenericStatus } from './genericStatus';

export interface CreateClassroomRequestData {
  name: string;
  capacity: number;
}

export interface Classroom extends CreateClassroomRequestData {
  guid?: string;
  status: GenericStatus;
}
