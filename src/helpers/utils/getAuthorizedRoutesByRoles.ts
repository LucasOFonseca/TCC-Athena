import { EmployeeRole } from '@athena-types/employee';

const prefix = '/panel';

const baseRoutes = [
  prefix,
  `${prefix}/students`,
  `${prefix}/disciplines`,
  `${prefix}/courses`,
  `${prefix}/classrooms`,
  `${prefix}/class-schedules`,
  `${prefix}/matrices`,
  `${prefix}/periods`,
];

const authorizedRoutesByRole: { [key in EmployeeRole]: string[] } = {
  [EmployeeRole.coordinator]: baseRoutes,
  [EmployeeRole.secretary]: baseRoutes,
  [EmployeeRole.principal]: [...baseRoutes, `${prefix}/employees`],
  [EmployeeRole.educator]: [prefix, `${prefix}/attendances`],
};

export function getAuthorizedRoutesByRoles(roles: EmployeeRole[]) {
  const authorizedRoutes = roles.flatMap(
    (role) => authorizedRoutesByRole[role]
  );

  const uniqueRoutes = authorizedRoutes.filter((route, index, array) => {
    return array.indexOf(route) === index;
  });

  return uniqueRoutes;
}
