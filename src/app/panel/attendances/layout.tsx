import { getQueryClient } from '@helpers/utils';
import { disciplineService } from '@services/discipline';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Frequências',
};

export default async function AttendancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const token = cookies().get('alohomora')?.value;

  await queryClient.prefetchQuery(['attendances', 1, 'all', ''], {
    queryFn: () => disciplineService.getPaginated(undefined, token),
    staleTime: Infinity,
  });

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
