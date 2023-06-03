import { EditOutlined } from '@ant-design/icons';
import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { StatusButton } from '@components/StatusButton';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Cell = styled.td`
  position: relative;
  height: 80px;
  text-align: center;
  padding: 45px 12px 12px;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px;
`;

interface ClassScheduleCellProps {
  classSchedule: ClassSchedule;
  onChangeStatus: (guid: string, currentStatus: GenericStatus) => void;
  onEdit: (schedules: ClassSchedule[]) => void;
}

export const ClassScheduleCell: React.FC<ClassScheduleCellProps> = ({
  classSchedule,
  onChangeStatus,
  onEdit,
}) => {
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const keepOpen = () => {
      if (window.innerWidth <= 900 && !showActions) {
        setShowActions(true);
      } else if (window.innerWidth > 900 && showActions) {
        setShowActions(false);
      }
    };

    window.addEventListener('resize', keepOpen);

    return () => {
      window.removeEventListener('resize', keepOpen);
    };
  });

  return (
    <Cell
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={
        classSchedule.status === GenericStatus.inactive
          ? { color: 'rgba(0, 0, 0, 0.25)' }
          : undefined
      }
    >
      {showActions && (
        <ActionsContainer>
          <StatusButton
            currentStatus={classSchedule.status}
            onClick={() =>
              onChangeStatus(classSchedule.guid as string, classSchedule.status)
            }
          />

          <Tooltip placement="bottom" title="Editar">
            <Button
              size="middle"
              shape="circle"
              type="text"
              onClick={() => onEdit([classSchedule])}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        </ActionsContainer>
      )}
      {dayjs(classSchedule.startTime).format('HH:mm')} -{' '}
      {dayjs(classSchedule.endTime).format('HH:mm')}
    </Cell>
  );
};
