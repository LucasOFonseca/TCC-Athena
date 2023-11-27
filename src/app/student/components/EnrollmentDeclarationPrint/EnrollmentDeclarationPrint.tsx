import { Print } from '@components/print';
import { useHydratePersistedState } from '@helpers/hooks';
import { studentService } from '@services/student';
import { useUser } from '@stores/useUser';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface EnrollmentDeclarationPrintProps {
  periodGuid?: string;
  clearGuid: () => void;
}

export const EnrollmentDeclarationPrint: React.FC<
  EnrollmentDeclarationPrintProps
> = ({ periodGuid, clearGuid }) => {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: clearGuid,
  });

  const { data } = useQuery(['student', 'periods', periodGuid, 'details'], {
    queryFn: () => studentService.getPeriodDetails(periodGuid ?? ''),
    staleTime: Infinity,
    enabled: !!periodGuid,
  });

  useEffect(() => {
    if (periodGuid && data && data.guid === periodGuid) print();
  }, [periodGuid, data]);

  return (
    <Print.Container ref={printRef}>
      <Print.Header />

      <Print.Content>
        <Print.Title>declaração de matricula</Print.Title>

        <p>
          Declaramos para os devidos fins que <strong>{user?.name}</strong>,{' '}
          portador(a) do CPF:{' '}
          <strong>
            {user?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
          </strong>{' '}
          e número de matricula <strong>{data?.enrollmentNumber}</strong> está
          regulamente matriculado(a) no curso <strong>{data?.course}</strong>,
          com aulas que{' '}
          {dayjs(data?.classesStartDate).isAfter(dayjs()) ? (
            <>
              se iniciam em{' '}
              <strong>
                {dayjs(data?.classesStartDate).format('DD/MM/YYYY')}
              </strong>{' '}
              e{' '}
            </>
          ) : null}
          vão até{' '}
          <strong>{dayjs(data?.classesStartDate).format('DD/MM/YYYY')}</strong>.
        </p>
      </Print.Content>

      <Print.Footer />
    </Print.Container>
  );
};
