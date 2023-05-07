import { EmployeeRole } from '@athena-types/employee';

interface RoleProps {
  translated: string;
  color: 'gold' | 'geekblue' | 'purple' | 'green';
  colorHex: string;
}

export function getRoleProps(role: EmployeeRole) {
  const props: { [key: string]: RoleProps } = {
    [EmployeeRole.coordinator]: {
      translated: 'Coordenador',
      color: 'purple',
      colorHex: '#722ED1',
    },
    [EmployeeRole.educator]: {
      translated: 'Professor',
      color: 'geekblue',
      colorHex: '#2F54EB',
    },
    [EmployeeRole.principal]: {
      translated: 'Diretor',
      color: 'gold',
      colorHex: '#FAAD14',
    },
    [EmployeeRole.secretary]: {
      translated: 'Secretário',
      color: 'green',
      colorHex: '#52C41A',
    },
  };

  return props[role];
}
