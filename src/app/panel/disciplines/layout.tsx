import { getQueryClient } from '@helpers/utils';
import { disciplineService } from '@services/discipline';
import { Hydrate, dehydrate } from '@tanstack/react-query';

export const metadata = {
  title: 'Disciplinas',
};

export default async function DisciplinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(['disciplines', 1, 'all', ''], {
    queryFn: () => disciplineService.getPaginated(),
    staleTime: Infinity,
  });

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
