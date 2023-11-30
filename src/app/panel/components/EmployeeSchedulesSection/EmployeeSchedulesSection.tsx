import { SchedulesTable } from '@components/SchedulesTable';
import { useHydratePersistedState } from '@helpers/hooks';
import { employeeService } from '@services/employee';
import { useUser } from '@stores/useUser';
import { useQuery } from '@tanstack/react-query';

export const EmployeeSchedulesSection: React.FC = () => {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  const { data } = useQuery(['educatorSchedules', user?.guid], {
    queryFn: () => employeeService.getEducatorSchedules(user?.guid ?? ''),
    enabled: !!user?.guid,
    staleTime: Infinity,
  });

  return (
    <>
      <h5 style={{ marginTop: 32 }}>Horários</h5>

      {data && <SchedulesTable schedules={data} />}
    </>
  );
};
