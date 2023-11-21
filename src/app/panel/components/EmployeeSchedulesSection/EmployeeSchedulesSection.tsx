import { useHydratePersistedState } from '@helpers/hooks';
import { employeeService } from '@services/employee';
import { shiftService } from '@services/shift';
import { useUser } from '@stores/useUser';
import { useQuery } from '@tanstack/react-query';
import { EmployeeSchedulesMatrix } from './components/EmployeeSchedulesMatrix';

export const EmployeeSchedulesSection: React.FC = () => {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  const { data: employeeSchedules } = useQuery(
    ['employeeSchedules', user?.guid],
    {
      queryFn: () => employeeService.getSchedules(user?.guid ?? ''),
      enabled: !!user?.guid,
      staleTime: Infinity,
    }
  );

  const { data: shifts } = useQuery(['shifts'], {
    queryFn: () => shiftService.getAll(),
    enabled: !!employeeSchedules && employeeSchedules.length > 0,
    staleTime: Infinity,
  });

  const { data: morningClassSchedules } = useQuery(
    ['shifts', shifts?.[0].guid ?? '', 'classSchedules'],
    {
      queryFn: () => shiftService.getClassSchedules(shifts?.[0].guid ?? ''),
      enabled:
        !!shifts &&
        employeeSchedules?.some(({ schedules }) =>
          schedules.some(({ shiftGuid }) => shiftGuid === shifts?.[0].guid)
        ),
      staleTime: Infinity,
    }
  );

  const { data: afternoonClassSchedules } = useQuery(
    ['shifts', shifts?.[1].guid ?? '', 'classSchedules'],
    {
      queryFn: () => shiftService.getClassSchedules(shifts?.[1].guid ?? ''),
      enabled:
        !!shifts &&
        employeeSchedules?.some(({ schedules }) =>
          schedules.some(({ shiftGuid }) => shiftGuid === shifts?.[1].guid)
        ),
      staleTime: Infinity,
    }
  );

  const { data: eveningClassSchedules } = useQuery(
    ['shifts', shifts?.[2].guid ?? '', 'classSchedules'],
    {
      queryFn: () => shiftService.getClassSchedules(shifts?.[2].guid ?? ''),
      enabled:
        !!shifts &&
        employeeSchedules?.some(({ schedules }) =>
          schedules.some(({ shiftGuid }) => shiftGuid === shifts?.[2].guid)
        ),
      staleTime: Infinity,
    }
  );

  return (
    <>
      <h5 style={{ marginTop: 32 }}>Horários da semana</h5>

      {morningClassSchedules && morningClassSchedules.length > 0 ? (
        <>
          <h6 style={{ marginTop: 16, marginBottom: 8 }}>Matutino</h6>

          <EmployeeSchedulesMatrix
            employeeSchedules={employeeSchedules ?? []}
            classSchedules={morningClassSchedules}
          />
        </>
      ) : null}

      {afternoonClassSchedules && afternoonClassSchedules.length > 0 ? (
        <>
          <h6 style={{ marginTop: 32, marginBottom: 8 }}>Vespertino</h6>

          <EmployeeSchedulesMatrix
            employeeSchedules={employeeSchedules ?? []}
            classSchedules={afternoonClassSchedules}
          />
        </>
      ) : null}

      {eveningClassSchedules && eveningClassSchedules.length > 0 ? (
        <>
          <h6 style={{ marginTop: 32, marginBottom: 8 }}>Vespertino</h6>

          <EmployeeSchedulesMatrix
            employeeSchedules={employeeSchedules ?? []}
            classSchedules={eveningClassSchedules}
          />
        </>
      ) : null}
    </>
  );
};
