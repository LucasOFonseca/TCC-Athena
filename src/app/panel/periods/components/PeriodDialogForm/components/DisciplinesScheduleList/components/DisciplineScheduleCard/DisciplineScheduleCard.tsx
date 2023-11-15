import { ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { translateDayOfWeek } from '@helpers/utils';
import { Alert, Button, Card, Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  .ant-card-head {
    min-height: unset !important;
    padding: 8px 16px;
  }

  .ant-card-body {
    padding: 8px 16px;
  }
`;

interface DisciplineScheduleCardProps {
  index: number;
  form: FormInstance<PeriodForm>;
  onAction: (disciplineSchedule: DisciplineSchedule) => void;
}

export const DisciplineScheduleCard: React.FC<DisciplineScheduleCardProps> = ({
  index,
  form,
  onAction,
}) => {
  const disciplineSchedule = Form.useWatch('disciplinesSchedule', form)?.[
    index
  ];

  return (
    <StyledCard title={disciplineSchedule?.disciplineName}>
      {disciplineSchedule?.employeeName ? (
        <div>
          <strong>Professor:</strong>

          <p style={{ marginTop: 4 }}>{disciplineSchedule?.employeeName}</p>
        </div>
      ) : null}

      {disciplineSchedule?.schedules.length ? (
        <>
          <div style={{ marginTop: 16 }}>
            <strong>Aulas:</strong>

            <p style={{ marginTop: 4 }}>
              {disciplineSchedule?.schedules
                .map(
                  (s) =>
                    `${translateDayOfWeek(s.dayOfWeek, true)} (${dayjs(
                      s.startTime
                    ).format('HH:mm')} - ${dayjs(s.endTime).format('HH:mm')})`
                )
                .join(', ')}
            </p>
          </div>

          <Button
            block
            style={{ marginTop: 16 }}
            icon={<EditOutlined />}
            onClick={() => onAction(disciplineSchedule)}
          >
            Editar cronograma
          </Button>
        </>
      ) : (
        <>
          <Alert
            message="Selecione um professor e defina um cronograma para a disciplina"
            type="warning"
            showIcon
          />

          <Button
            block
            style={{ marginTop: 16 }}
            icon={<ClockCircleOutlined />}
            onClick={() => onAction(disciplineSchedule as DisciplineSchedule)}
          >
            Definir cronograma
          </Button>
        </>
      )}
    </StyledCard>
  );
};
