'use client';

import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
`;

export default function GradesPage() {
  const router = useRouter();

  const { data } = useQuery(['employee', 'periods'], {
    queryFn: () => employeeService.getPeriods(),
    staleTime: Infinity,
  });

  return (
    <>
      <h4>Períodos vigentes</h4>

      <Container>
        {data?.map((period) => (
          <Card
            key={period.guid}
            hoverable
            style={{ maxWidth: 325 }}
            onClick={() => router.push(`/panel/grades/${period.guid}`)}
          >
            <p>{period.name}</p>
          </Card>
        ))}
      </Container>
    </>
  );
}
