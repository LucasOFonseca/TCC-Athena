'use client';

import { useHydratePersistedState } from '@helpers/hooks';
import { studentService } from '@services/student';
import { useUser } from '@stores/useUser';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useState } from 'react';
import { EnrollmentDeclarationPrint } from './components/EnrollmentDeclarationPrint';
import { PeriodCard } from './components/PeriodCard';
import { SchedulesTable } from './components/SchedulesTable';

export default function StudentPanel() {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  const { data: periods } = useQuery(
    ['student', 'periods'],
    studentService.getPeriods
  );
  const { data: schedules } = useQuery(
    ['student', 'schedules'],
    studentService.getSchedules
  );

  const [periodGuid, setPeriodGuid] = useState<string>();

  return (
    <>
      <EnrollmentDeclarationPrint
        periodGuid={periodGuid}
        clearGuid={() => setPeriodGuid(undefined)}
      />

      <h4 style={{ marginBottom: 32 }}>
        Olá {user?.name.split(' ')[0]}, bem-vindo(a) ao Athena
      </h4>

      <h5>Cursos</h5>

      <Divider orientation="left" style={{ margin: 0 }} />

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {periods?.map((period) => (
          <PeriodCard
            key={period.guid}
            period={period}
            onPrint={setPeriodGuid}
          />
        ))}
      </div>

      {schedules ? (
        <>
          <h5 style={{ marginTop: 48 }}>Horários</h5>

          <Divider orientation="left" style={{ margin: 0 }} />

          <SchedulesTable schedules={schedules} />
        </>
      ) : null}
    </>
  );
}
