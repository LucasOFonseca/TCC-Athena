'use client';

import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, Card } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
`;

interface Params {
  periodGuid: string;
}

interface GradesPageProps {
  params: Params;
}

export default function GradesPage({ params }: GradesPageProps) {
  const router = useRouter();

  const { periodGuid } = params;

  const { data: periods } = useQuery(['employee', 'periods'], {
    queryFn: () => employeeService.getPeriods(),
    staleTime: Infinity,
  });

  const { data: disciplines } = useQuery(
    ['employee', 'periods', periodGuid, 'disciplines'],
    {
      queryFn: () => employeeService.getDisciplinesByPeriod(periodGuid),
      enabled: !!periodGuid,
      staleTime: Infinity,
    }
  );

  const currentPeriod = periods?.find((period) => period.guid === periodGuid);

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link href="/panel/grades">Períodos vigentes</Link>,
          },
          {
            title: currentPeriod?.name,
          },
        ]}
      />

      <h4 style={{ marginTop: 32 }}>Disciplinas</h4>

      <Container>
        {disciplines?.map((discipline) => (
          <Card
            key={discipline.guid}
            hoverable
            style={{ width: 325 }}
            onClick={() =>
              router.push(`/panel/grades/${periodGuid}/${discipline.guid}`)
            }
          >
            <p>{discipline.name}</p>
          </Card>
        ))}
      </Container>
    </>
  );
}
