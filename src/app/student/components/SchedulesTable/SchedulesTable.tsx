import { SchedulesByShift } from '@athena-types/studentSchedule';
import styled from 'styled-components';
import { SchedulesByShiftTable } from './components/SchedulesByShiftTable';

const Container = styled.div`
  display: flex;
  margin-top: 16px;
  border: 1px solid #f0f0f0;
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
    </Container>
  );
};
