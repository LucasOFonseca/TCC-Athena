'use client';

import { EmployeeRole } from '@athena-types/employee';
import { useHydratePersistedState } from '@helpers/hooks';
import { useUser } from '@stores/useUser';
import { Divider } from 'antd';
import styled from 'styled-components';
import { EmployeePeriodsSection } from './components/EmployeePeriodsSection';
import { EmployeeSchedulesSection } from './components/EmployeeSchedulesSection';

const ContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #a0a0a0;
  margin-top: 32px;
`;

const CardPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 125px;
  width: 100%;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

export default function Panel() {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  return (
    <>
      <h4>Olá {user?.name.split(' ')[0]}, bem-vindo(a) ao Athena</h4>

      {user?.roles.some((role) => role === EmployeeRole.educator) ? (
        <>
          <EmployeePeriodsSection />

          <Divider />

          <EmployeeSchedulesSection />
        </>
      ) : null}
    </>
  );
}
