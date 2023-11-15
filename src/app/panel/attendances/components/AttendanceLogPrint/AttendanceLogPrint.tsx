import { Print } from '@components/print';
import { attendanceLogService } from '@services/attendanceLog';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border: 1px solid #000;
  margin-top: 0.5rem;

  th,
  td {
    padding: 0.25rem 0.5rem;

    &:not(:last-of-type) {
      border-right: 1px solid #000;
    }

    &:not(:first-of-type) {
      text-align: center;
      width: 100px;
    }
  }

  th {
    border-bottom: 1px solid #000;

    &:first-of-type {
      text-align: left;
    }
  }

  tbody {
    tr:not(:last-of-type) {
      td {
        border-bottom: 1px solid #000;
      }
    }
  }
`;

interface AttendanceLogPrintProps {
  guid?: string;
  periodName: string;
  disciplineName: string;
  clearGuid: () => void;
}

export const AttendanceLogPrint: React.FC<AttendanceLogPrintProps> = ({
  guid,
  periodName,
  disciplineName,
  clearGuid,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: clearGuid,
  });

  const { data } = useQuery({
    queryKey: ['attendanceLog', guid],
    queryFn: () => attendanceLogService.getByGuid(guid ?? ''),
    onSuccess: () => print(),
    staleTime: Infinity,
    enabled: !!guid,
  });

  useEffect(() => {
    if (guid && data && data.guid === guid) print();
  }, [guid, data]);

  return (
    <Print.Container ref={printRef}>
      <Print.Header />

      {data && (
        <Print.Content>
          <h5
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.125rem',
              textTransform: 'uppercase',
            }}
          >
            registro de aula
          </h5>

          <div style={{ margin: '2rem 0', fontSize: '1rem' }}>
            <p>
              <strong>Data:</strong>{' '}
              {dayjs(data.classDate).format('DD/MM/YYYY')}
            </p>

            <p style={{ marginTop: '0.5rem' }}>
              <strong>Período:</strong> {periodName}
            </p>

            <p style={{ marginTop: '0.5rem' }}>
              <strong>Disciplina:</strong> {disciplineName}
            </p>

            <p style={{ marginTop: '0.5rem' }}>
              <strong>Aulas ministradas:</strong> {data.totalClasses}
            </p>

            <p style={{ marginTop: '1rem' }}>
              <strong>Conteúdo ministrado:</strong> {data.classSummary}
            </p>
          </div>

          <h6
            style={{
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Frequência
          </h6>

          <Table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Presenças</th>
                <th>Faltas</th>
              </tr>
            </thead>

            <tbody>
              {data.studentAbsences.map(
                ({ guid, studentName, totalAbsences, totalPresences }) => (
                  <tr key={guid}>
                    <td>{studentName}</td>
                    <td>{totalPresences ? totalPresences : '-'}</td>
                    <td>{totalAbsences ? totalAbsences : '-'}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Print.Content>
      )}

      <Print.Footer />
    </Print.Container>
  );
};
