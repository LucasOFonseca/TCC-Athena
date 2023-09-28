import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { Form, FormInstance } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { DisciplineScheduleCard } from './components/DisciplineScheduleCard';
import { DisciplineScheduleDialogForm } from './components/DisciplineScheduleDialogForm';

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
  const [
    showDisciplineScheduleDialogForm,
    setShowDisciplineScheduleDialogForm,
  ] = useState(false);
  const [index, setIndex] = useState(0);
  const [disciplineSchedule, setDisciplineSchedule] =
    useState<DisciplineSchedule>();

  const handleOpenDisciplineScheduleDialogForm = (
    value: DisciplineSchedule,
    index: number
  ) => {
    setShowDisciplineScheduleDialogForm(true);
    setDisciplineSchedule(value);
    setIndex(index);
  };

  const handleCloseDisciplineScheduleDialogForm = () => {
    setShowDisciplineScheduleDialogForm(false);
    setDisciplineSchedule(undefined);
  };

  return (
    <>
      <DisciplineScheduleDialogForm
        open={showDisciplineScheduleDialogForm}
        form={form}
        index={index}
        disciplineSchedule={disciplineSchedule}
        onClose={handleCloseDisciplineScheduleDialogForm}
      />

      <Container>
        <Form.List name="disciplinesSchedule">
          {(fields) => (
            <>
              {fields.map((field, index) => (
                <DisciplineScheduleCard
                  key={field.key}
                  index={index}
                  form={form}
                  onAction={(value) =>
                    handleOpenDisciplineScheduleDialogForm(value, index)
                  }
                />
              ))}
            </>
          )}
        </Form.List>
      </Container>
    </>
  );
};
