'use client';

import { useQuery } from '@tanstack/react-query';
import { disciplineService } from '../../../../../services/discipline';

export const DisciplinesTable: React.FC = () => {
  const { data } = useQuery(['disciplines'], {
    queryFn: () => disciplineService.getPaginated(),
    staleTime: 1000 * 30,
  });

  return (
    <>
      {data?.data.map((discipline) => (
        <div key={discipline.guid}>{discipline.name}</div>
      ))}
    </>
  );
};
