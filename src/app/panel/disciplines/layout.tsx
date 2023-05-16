import { getQueryClient } from '@helpers/utils';
import { disciplineService } from '@services/discipline';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Disciplinas',
};

export default async function DisciplinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const token = cookies().get('alohomora')?.value;

  await queryClient.prefetchQuery(['disciplines', 1, 'all', ''], {
    queryFn: () => disciplineService.getPaginated(undefined, token),
    staleTime: Infinity,
  });

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
