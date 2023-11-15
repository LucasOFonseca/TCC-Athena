'use client';

import { employeeService } from '@services/employee';
import { periodService } from '@services/period';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { DisciplineConfigCard } from './components/DisciplineConfigCard';
import { StudentGradesForm } from './components/StudentGradesForm';
import { StudentsGradesTable } from './components/StudentsGradesTable';

interface Params {
  periodGuid: string;
  disciplineGuid: string;
}

interface GradesPageProps {
  params: Params;
}

export default function GradesPage({ params }: GradesPageProps) {
  const { periodGuid, disciplineGuid } = params;

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
  const { data: config } = useQuery(
    [
      'employee',
      'periods',
      periodGuid,
      'disciplines',
      disciplineGuid,
      'config',
    ],
    {
      queryFn: () =>
        periodService.getDisciplineGradeConfig(periodGuid, disciplineGuid),
      enabled: !!periodGuid,
      staleTime: Infinity,
    }
  );
  const { data: grades } = useQuery(
    [
      'employee',
      'periods',
      periodGuid,
      'disciplines',
      disciplineGuid,
      'grades',
    ],
    {
      queryFn: () =>
        periodService.getStudentsGrades(periodGuid, disciplineGuid),
      enabled: !!periodGuid,
      staleTime: Infinity,
    }
  );

  const currentPeriod = periods?.find((period) => period.guid === periodGuid);
  const currentDiscipline = disciplines?.find(
    (discipline) => discipline.guid === disciplineGuid
  );

  const [showStudentsGradesForm, setShowStudentsGradesForm] = useState(false);
  const [showDisciplineConfigForm, setShowDisciplineConfigForm] =
    useState(false);

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link href="/panel/grades">Períodos vigentes</Link>,
          },
          {
            title: (
              <Link href={`/panel/grades/${periodGuid}`}>
                {currentPeriod?.name}
              </Link>
            ),
          },
          {
            title: currentDiscipline?.name,
          },
        ]}
      />

      <h4 style={{ marginTop: 32 }}>{currentDiscipline?.name}</h4>

      {config ? (
        <DisciplineConfigCard
          disableEdit={showStudentsGradesForm}
          config={config}
          periodGuid={periodGuid}
          disciplineGuid={disciplineGuid}
          showForm={showDisciplineConfigForm}
          toggleForm={() =>
            setShowDisciplineConfigForm(!showDisciplineConfigForm)
          }
        />
      ) : null}

      {config && grades && currentPeriod && currentDiscipline ? (
        <>
          {showStudentsGradesForm ? (
            <StudentGradesForm
              periodGuid={periodGuid}
              disciplineGuid={disciplineGuid}
              config={config}
              grades={grades}
              onCancel={() => setShowStudentsGradesForm(false)}
              onSubmitFinish={() => setShowStudentsGradesForm(false)}
            />
          ) : (
            <StudentsGradesTable
              disableEdit={showDisciplineConfigForm}
              period={currentPeriod}
              discipline={currentDiscipline}
              config={config}
              grades={grades}
              onShowStudentsGradesForm={() => setShowStudentsGradesForm(true)}
            />
          )}
        </>
      ) : null}
    </>
  );
}
