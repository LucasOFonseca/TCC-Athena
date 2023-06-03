import { getQueryClient } from '@helpers/utils';
import { shiftService } from '@services/shift';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Horários',
};

export default async function ClassSchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const token = cookies().get('alohomora')?.value;

  await queryClient.prefetchQuery(['shifts'], {
    queryFn: () => shiftService.getAll(token),
    staleTime: Infinity,
  });

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
