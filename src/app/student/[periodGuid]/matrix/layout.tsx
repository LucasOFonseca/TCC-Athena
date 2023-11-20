import { getQueryClient } from '@helpers/utils';
import { Hydrate, dehydrate } from '@tanstack/react-query';

export const metadata = {
  title: 'Curso | Matriz',
};

export default async function StudentPeriodMatrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
