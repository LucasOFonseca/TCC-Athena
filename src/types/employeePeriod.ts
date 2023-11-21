import { FilterItem } from './filterItem';

export interface EmployeePeriod {
  guid: string;
  name: string;
  disciplines: FilterItem[];
}
