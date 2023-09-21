import { MatrixModule } from '@athena-types/matrix';
import { PeriodForm } from '@athena-types/period';
import { matrixService } from '@services/matrix';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DisciplineScheduleCard } from './components/DisciplineScheduleCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface DisciplinesScheduleListProps {
  form: FormInstance<PeriodForm>;
}

export const DisciplinesScheduleList: React.FC<
  DisciplinesScheduleListProps
> = ({ form }) => {
  const { setFieldValue } = form;

  const selectedMatrixGuid = Form.useWatch('matrixGuid', form);
  const selectedMatrixModuleGuid = Form.useWatch('matrixModuleGuid', form);

  const [matrixModule, setMatrixModule] = useState<MatrixModule>();

  const { data: matrix, isLoading } = useQuery(['matrix', selectedMatrixGuid], {
    queryFn: () => matrixService.getByGuid(selectedMatrixGuid),
    staleTime: Infinity,
    enabled: selectedMatrixGuid !== undefined,
  });

  useEffect(() => {
    if (!matrix) return;

    const selectedModule = matrix.modules.find(
      (m) => m.guid === selectedMatrixModuleGuid
    );

    if (!selectedModule) return;

    setMatrixModule(selectedModule);
  }, [matrix, selectedMatrixModuleGuid]);

  return (
    <Container>
      {matrixModule?.disciplines.map((discipline) => (
        <DisciplineScheduleCard
          key={discipline.guid}
          disciplineSchedule={{
            disciplineName: discipline.name,
            disciplineGuid: discipline.guid,
            employeeGuid: '',
            employeeName: '',
            schedules: [],
          }}
        />
      ))}
    </Container>
  );
};
