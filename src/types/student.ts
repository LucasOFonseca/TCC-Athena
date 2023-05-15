import { Address } from './address';
import { GenericStatus } from './genericStatus';

export interface CreateStudentRequestData {
  name: string;
  cpf: string;
  email: string;
  address: Address;
  birthdate: string;
  phoneNumber: string;
}

export interface Student extends CreateStudentRequestData {
  guid?: string;
  status: GenericStatus;
}
