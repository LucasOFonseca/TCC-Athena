import { SchedulesByDayOfWeek } from '@athena-types/studentSchedule';
import { translateDayOfWeek } from '@helpers/utils';
import dayjs from 'dayjs';
import styled from 'styled-components';

const Title = styled.div`
  width: 100%;
  padding: 8px;
  background-color: #f0f0f0;
`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div`
  width: 100%;
  padding: 8px;
`;

interface SchedulesByShiftTableProps {
  title: string;
  schedules: SchedulesByDayOfWeek[];
}

export const SchedulesByShiftTable: React.FC<SchedulesByShiftTableProps> = ({
  title,
  schedules,
}) => {
  return (
    <div style={{ width: '100%', border: '1px solid #f0f0f0' }}>
      <Title>
        <h6>{title}</h6>
      </Title>

      <Row style={{ borderBottom: '1px solid #f0f0f0' }}>
        <Cell
          style={{
            minWidth: 100,
            width: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <strong style={{ textAlign: 'center' }}>Dia</strong>
        </Cell>

        <Cell>
          <strong>Curso/Disciplina</strong>
        </Cell>

        <Cell
          style={{
            minWidth: 200,
            width: 200,
          }}
        >
          <strong>Sala</strong>
        </Cell>

        <Cell>
          <strong>Início/Fim</strong>
        </Cell>
      </Row>

      {schedules.map(({ dayOfWeek, schedules }) => (
        <Row key={dayOfWeek}>
          <Cell
            style={{
              width: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid #f0f0f0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {translateDayOfWeek(dayOfWeek, true)}
          </Cell>

          <div style={{ width: '100%' }}>
            {schedules.map(
              ({
                course,
                classroom,
                discipline,
                educator,
                endTime,
                startTime,
              }) => (
                <Row key={course} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <Cell>
                    {course}/{discipline}
                  </Cell>

                  <Cell
                    style={{
                      minWidth: 200,
                      width: 200,
                    }}
                  >
                    {classroom}
                  </Cell>

                  <Cell>
                    de {dayjs(startTime).format('HH:mm')} às{' '}
                    {dayjs(endTime).format('HH:mm')}
                  </Cell>
                </Row>
              )
            )}
          </div>
        </Row>
      ))}
    </div>
  );
};
