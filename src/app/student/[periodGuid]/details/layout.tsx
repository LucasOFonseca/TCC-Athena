import { getQueryClient } from '@helpers/utils';
import { Hydrate, dehydrate } from '@tanstack/react-query';

export const metadata = {
  title: 'Curso | Detalhes',
};

export default async function StudentPeriodDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
