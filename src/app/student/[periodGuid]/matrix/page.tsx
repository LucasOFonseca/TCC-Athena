'use client';

import { LeftOutlined, PrinterFilled } from '@ant-design/icons';
import { studentService } from '@services/student';
import { useQuery } from '@tanstack/react-query';
import { Button, Space, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { PeriodMatrixModulesTable } from './components/PeriodMatrixModulesTable';
import { PeriodMatrixPrint } from './components/PeriodMatrixPrint';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
`;

interface Params {
  periodGuid: string;
}

interface StudentPeriodMatrixPageProps {
  params: Params;
}

export default function StudentPeriodMatrixPage({
  params,
}: StudentPeriodMatrixPageProps) {
  const { push } = useRouter();

  const { periodGuid } = params;

  const { data } = useQuery(['student', 'periods', periodGuid, 'matrix'], {
    queryFn: () => studentService.getPeriodMatrix(periodGuid),
    staleTime: Infinity,
    enabled: !!periodGuid,
  });

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      {data ? <PeriodMatrixPrint ref={printRef} data={data} /> : null}

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

          <h4>Matriz</h4>
        </Space>

        <Tooltip arrow placement="bottom" title="Imprimir">
          <Button shape="circle" type="text" onClick={() => print()}>
            <PrinterFilled />
          </Button>
        </Tooltip>
      </div>

      <h6 style={{ marginTop: 32, textAlign: 'center' }}>
        {data?.course} - {data?.name}
      </h6>

      <PeriodMatrixModulesTable
        totalWorkload={data?.totalWorkload ?? 0}
        modules={data?.modules ?? []}
      />
    </>
  );
}
