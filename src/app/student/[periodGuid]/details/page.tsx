'use client';

import { LeftOutlined, PrinterFilled } from '@ant-design/icons';
import { useHydratePersistedState } from '@helpers/hooks';
import { studentService } from '@services/student';
import { useUser } from '@stores/useUser';
import { useQuery } from '@tanstack/react-query';
import { Button, Divider, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { PeriodDetailsPrint } from './components/PeriodDetailsPrint';
import { PeriodDisciplinesTable } from './components/PeriodDisciplinesTable';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
`;

interface Params {
  periodGuid: string;
}

interface StudentPeriodDetailsPageProps {
  params: Params;
}

export default function StudentPeriodDetailsPage({
  params,
}: StudentPeriodDetailsPageProps) {
  const { push } = useRouter();

  const { periodGuid } = params;

  const user = useHydratePersistedState(useUser(({ user }) => user));

  const { data } = useQuery(['student', 'periods', periodGuid, 'details'], {
    queryFn: () => studentService.getPeriodDetails(periodGuid),
    staleTime: Infinity,
    enabled: !!periodGuid,
  });

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      {data && user ? (
        <PeriodDetailsPrint
          ref={printRef}
          studentName={user.name}
          data={data}
        />
      ) : null}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Space>
          <Tooltip arrow placement="bottom" title="Voltar">
            <Button
              size="middle"
              shape="circle"
              type="text"
              onClick={() => push('/student')}
            >
              <LeftOutlined />
            </Button>
          </Tooltip>

          <h4>Histórico</h4>
        </Space>

        <Tooltip arrow placement="bottom" title="Imprimir">
          <Button shape="circle" type="text" onClick={() => print()}>
            <PrinterFilled />
          </Button>
        </Tooltip>
      </div>

      <InfoContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <p>
            <strong>Aluno:</strong> {user?.name}
          </p>

          <p>
            <strong>Nº de matrícula:</strong> {data?.enrollmentNumber}
          </p>
        </div>

        <Divider style={{ margin: 0 }} />

        <p>
          <strong>Curso:</strong> {data?.course}
        </p>

        <p>
          <strong>Matriz:</strong> {data?.matrix}
        </p>

        <p>
          <strong>Módulo:</strong> {data?.module}
        </p>

        <p>
          <strong>Turma:</strong> {data?.classId}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <p>
            <strong>Início:</strong>{' '}
            {dayjs(data?.classesStartDate).format('DD/MM/YYYY')}
          </p>

          <p>
            <strong>Fim:</strong> {dayjs(data?.deadline).format('DD/MM/YYYY')}
          </p>
        </div>
      </InfoContainer>

      <PeriodDisciplinesTable disciplines={data?.disciplines ?? []} />
    </>
  );
}
