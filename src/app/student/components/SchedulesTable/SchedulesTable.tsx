import { SchedulesByShift } from '@athena-types/studentSchedule';
import styled from 'styled-components';
import { SchedulesByShiftTable } from './components/SchedulesByShiftTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

interface SchedulesTableProps {
  schedules: SchedulesByShift;
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
}) => {
  return (
    <Container>
      {schedules.morning && (
        <SchedulesByShiftTable title="Matutino" schedules={schedules.morning} />
      )}

      {schedules.afternoon && (
        <SchedulesByShiftTable
          title="Vespertino"
          schedules={schedules.afternoon}
        />
      )}

      {schedules.evening && (
        <SchedulesByShiftTable title="Noturno" schedules={schedules.evening} />
      )}
    </Container>
  );
};
