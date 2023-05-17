import { EmployeeRole } from '@athena-types/employee';

const prefix = '/panel';

const baseRoutes = [
  prefix,
  `${prefix}/students`,
  `${prefix}/disciplines`,
  `${prefix}/courses`,
  `${prefix}/classrooms`,
];

const authorizedRoutesByRole: { [key in EmployeeRole]: string[] } = {
  [EmployeeRole.coordinator]: baseRoutes,
  [EmployeeRole.secretary]: baseRoutes,
  [EmployeeRole.principal]: [...baseRoutes, `${prefix}/employees`],
  [EmployeeRole.educator]: baseRoutes,
};

export function getAuthorizedRoutesByRoles(roles: EmployeeRole[]) {
  const authorizedRoutes = roles.map((role) => authorizedRoutesByRole[role])[0];

  const uniqueRoutes = authorizedRoutes.filter((route, index, array) => {
    return array.indexOf(route) === index;
  });

  return uniqueRoutes;
}
