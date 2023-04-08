import { getQueryClient } from '@helpers/utils';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { disciplineService } from '../../../services/discipline';
import { DisciplinesTable } from './components/DsiciplinesTable';

export default async function DisciplinesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(['disciplines'], {
    queryFn: () => disciplineService.getPaginated(),
    staleTime: 1000 * 30,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <h1>disciplines</h1>

      <DisciplinesTable />
    </Hydrate>
  );
}
