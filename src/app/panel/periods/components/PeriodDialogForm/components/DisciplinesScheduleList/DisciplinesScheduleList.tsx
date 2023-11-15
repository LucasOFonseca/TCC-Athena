import { PrinterFilled } from '@ant-design/icons';
import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { Button, Form, FormInstance } from 'antd';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { DisciplineScheduleCard } from './components/DisciplineScheduleCard';
import { DisciplineScheduleDialogForm } from './components/DisciplineScheduleDialogForm';
import { PeriodSchedulePrint } from './components/PeriodSchedulePrint';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface DisciplinesScheduleListProps {
  form: FormInstance<PeriodForm>;
  periodGuid?: string;
}

export const DisciplinesScheduleList: React.FC<
  DisciplinesScheduleListProps
> = ({ form, periodGuid }) => {
  const { getFieldsValue } = form;

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
  });

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

      {periodGuid && (
        <PeriodSchedulePrint
          period={getFieldsValue()}
          periodGuid={periodGuid}
          ref={printRef}
        />
      )}

      <Container>
        <Button icon={<PrinterFilled />} onClick={print}>
          Imprimir cronograma
        </Button>

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
