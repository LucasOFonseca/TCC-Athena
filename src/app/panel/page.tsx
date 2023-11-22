'use client';

import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { EmployeeRole } from '@athena-types/employee';
import { useHydratePersistedState } from '@helpers/hooks';
import { useUser } from '@stores/useUser';
import { Card, Divider } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { EmployeePeriodsSection } from './components/EmployeePeriodsSection';
import { EmployeeSchedulesSection } from './components/EmployeeSchedulesSection';

const LinkCard = styled(Card)`
  width: 100%;
`;

export default function Panel() {
  const { push } = useRouter();
  const user = useHydratePersistedState(useUser(({ user }) => user));

  return (
    <>
      <h4>Olá {user?.name.split(' ')[0]}, bem-vindo(a) ao Athena</h4>

      {user?.roles.some(
        (role) =>
          role === EmployeeRole.principal ||
          role === EmployeeRole.coordinator ||
          role === EmployeeRole.secretary
      ) ? (
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <LinkCard hoverable onClick={() => push('/panel/students')}>
            <Meta avatar={<UserOutlined />} title="Alunos" />
          </LinkCard>

          <LinkCard hoverable onClick={() => push('/panel/class-schedules')}>
            <Meta avatar={<ClockCircleOutlined />} title="Horários" />
          </LinkCard>

          <LinkCard hoverable onClick={() => push('/panel/matrices')}>
            <Meta avatar={<FileTextOutlined />} title="Matrizes" />
          </LinkCard>

          <LinkCard hoverable onClick={() => push('/panel/periods')}>
            <Meta avatar={<CalendarOutlined />} title="Períodos" />
          </LinkCard>
        </div>
      ) : null}

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
