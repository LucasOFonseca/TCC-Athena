import { Address } from './address';
import { GenericStatus } from './genericStatus';

export enum EmployeeRole {
  principal = 'principal',
  coordinator = 'coordinator',
  secretary = 'secretary',
  educator = 'educator',
}

export interface CreateEmployeeRequestData {
  name: string;
  cpf: string;
  email: string;
  address: Address;
  roles: EmployeeRole[];
  birthdate: string;
  phoneNumber: string;
}

export interface Employee extends CreateEmployeeRequestData {
  guid?: string;
  status: GenericStatus;
}
