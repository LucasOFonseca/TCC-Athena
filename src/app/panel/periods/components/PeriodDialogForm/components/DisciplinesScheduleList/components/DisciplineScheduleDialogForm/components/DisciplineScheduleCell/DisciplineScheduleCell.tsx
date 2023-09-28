import { CheckCircleFilled } from '@ant-design/icons';
import { ClassSchedule } from '@athena-types/classSchedule';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styled from 'styled-components';

const Cell = styled.td`
  height: 80px;
  text-align: start !important;
  vertical-align: baseline;
  padding: 8px;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    background-color: ${(props) =>
      props.disabled ? 'transparent' : 'rgba(0, 0, 0, 0.06)'};
  }
`;

interface DisciplineScheduleCellProps {
  isSelected: boolean;
  disableSelection: boolean;
  isEducatorBusy: boolean;
  scheduledDisciplineName?: string;
  classSchedule: ClassSchedule;
  onSelect: () => void;
  onUnselect: () => void;
}

export const DisciplineScheduleCell: React.FC<DisciplineScheduleCellProps> = ({
  isSelected,
  disableSelection,
  isEducatorBusy,
  scheduledDisciplineName,
  classSchedule,
  onSelect,
  onUnselect,
}) => {
  const isDisabled =
    isEducatorBusy ||
    (!isSelected && disableSelection) ||
    !!scheduledDisciplineName;

  useEffect(() => {
    if (isEducatorBusy && isSelected) {
      onUnselect();
    }
  }, [isEducatorBusy, isSelected]);

  return (
    <Cell
      disabled={isDisabled}
      style={{
        color: isDisabled ? 'rgba(0, 0, 0, 0.25)' : undefined,
        outline: isSelected ? '1px solid #52C41A' : undefined,
        outlineOffset: isSelected ? -1 : undefined,
      }}
      onClick={() => {
        if (isDisabled) return;

        if (isSelected) {
          onUnselect();

          return;
        }

        onSelect();
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <strong style={{ fontSize: '1rem' }}>
          {dayjs(classSchedule.startTime).format('HH:mm')} -{' '}
          {dayjs(classSchedule.endTime).format('HH:mm')}
        </strong>

        {isSelected && (
          <CheckCircleFilled style={{ color: '#52C41A', fontSize: 24 }} />
        )}
      </div>

      {isEducatorBusy && (
        <Tag style={{ marginTop: 8, width: '100%' }} color="orange">
          Prof. indisponível!
        </Tag>
      )}

      {scheduledDisciplineName && (
        <>
          <strong style={{ fontSize: '1rem' }}>Aula de:</strong>

          <p style={{ fontSize: '1rem' }}>{scheduledDisciplineName}</p>
        </>
      )}
    </Cell>
  );
};
