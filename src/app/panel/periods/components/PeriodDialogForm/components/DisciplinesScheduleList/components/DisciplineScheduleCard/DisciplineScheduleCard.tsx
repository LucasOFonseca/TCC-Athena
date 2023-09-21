import { DisciplineSchedule } from '@athena-types/period';
import { Card } from 'antd';

interface DisciplineScheduleCardProps {
  disciplineSchedule: DisciplineSchedule;
}

export const DisciplineScheduleCard: React.FC<DisciplineScheduleCardProps> = ({
  disciplineSchedule,
}) => {
  return <Card title={disciplineSchedule.disciplineName}></Card>;
};
