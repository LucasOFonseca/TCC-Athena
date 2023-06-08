import { GenericStatus } from './genericStatus';

export interface MatrixModuleDiscipline {
  guid: string;
  name: string;
  workload: number;
}

export interface MatrixModule {
  guid?: string;
  name: string;
  disciplines: MatrixModuleDiscipline[];
}

export interface CreateMatrixRequestData {
  name: string;
  courseGuid: string;
  modules: MatrixModule[];
}

export interface MatrixBase {
  guid: string;
  status: GenericStatus;
  name: string;
}

export interface Matrix extends CreateMatrixRequestData {
  guid?: string;
  status: GenericStatus;
}
