import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { allDaysOfWeek, translateDayOfWeek } from '@helpers/utils';
import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DisciplineScheduleCell } from '../DisciplineScheduleCell';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  background-color: #fff;

  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15));
`;

const Table = styled.table`
  width: 100%;
  min-width: 1100px;
  border-spacing: 0;

  thead {
    tr {
      th {
        width: 200px;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.88);
        padding: 8px;
        text-align: center;
        text-transform: capitalize;
        background-color: #fafafa;
        border-bottom: 1px solid #f0f0f0;

        &:not(:last-of-type) {
          position: relative;

          &:after {
            content: '';
            position: absolute;
            width: 1px;
            height: 50%;
            right: 0;
            top: 25%;
            background-color: #f0f0f0;
          }
        }

        &:first-of-type {
          width: 100px;
        }
      }
    }
  }

  tbody {
    tr {
      td {
        text-align: center;
      }

      td + td {
        border-left: 1px solid #f0f0f0;
      }

      &:not(:last-of-type) {
        td {
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }
  }
`;

interface DisciplineSchedulesMatrixProps {
  form: FormInstance<PeriodForm>;
  disableSelection: boolean;
  classSchedules: ClassSchedule[][];
  employeeGuid: string;
  disciplineName: string;
  selectedSchedules: ClassSchedule[];
  onSelect: (schedule: ClassSchedule) => void;
  onUnselect: (guid: string) => void;
}

export const DisciplineSchedulesMatrix: React.FC<
  DisciplineSchedulesMatrixProps
> = ({
  form,
  disableSelection,
  classSchedules,
  employeeGuid,
  disciplineName,
  selectedSchedules,
  onSelect,
  onUnselect,
}) => {
  const { getFieldValue } = form;

  const periodGuid = getFieldValue('guid');
  const disciplinesSchedule = Form.useWatch('disciplinesSchedule', form);

  const allClassSchedules = classSchedules
    .flat()
    .filter((schedule) => schedule.status === GenericStatus.active);

  const { data: employeeSchedules } = useQuery(
    ['employeeSchedules', employeeGuid],
    {
      queryFn: () => employeeService.getSchedules(employeeGuid),
      enabled: !!employeeGuid,
      staleTime: Infinity,
    }
  );

  const [otherPeriodSchedules, setOtherPeriodSchedules] = useState<
    ClassSchedule[]
  >([]);
  const [otherDisciplinesSchedule, setOtherDisciplinesSchedule] = useState<
    DisciplineSchedule[]
  >([]);

  useEffect(() => {
    const onlySchedules =
      employeeSchedules?.flatMap((disciplineSchedule) =>
        disciplineSchedule.periodGuid !== periodGuid
          ? disciplineSchedule.schedules
          : []
      ) ?? [];

    setOtherPeriodSchedules(onlySchedules);
  }, [employeeSchedules]);

  useEffect(() => {
    if (!disciplinesSchedule) return;

    setOtherDisciplinesSchedule(
      disciplinesSchedule.filter(
        (disciplineSchedule) =>
          disciplineSchedule.disciplineName !== disciplineName
      )
    );
  }, [disciplinesSchedule, disciplineName]);

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>Aula</th>

            {allDaysOfWeek.map((dayOfWeek) => {
              if (
                allClassSchedules.some(
                  (classSchedule) => classSchedule.dayOfWeek === dayOfWeek
                )
              ) {
                return (
                  <th key={dayOfWeek}>
                    {translateDayOfWeek(dayOfWeek, true)}.
                  </th>
                );
              }

              return null;
            })}
          </tr>
        </thead>

        <tbody>
          {classSchedules.map((classScheduleRow) => (
            <tr key={classScheduleRow[0].classNumber}>
              <td>{classScheduleRow[0].classNumber}ª aula</td>

              {allDaysOfWeek.map((dayOfWeek) => {
                if (
                  !allClassSchedules.some(
                    (classSchedule) => classSchedule.dayOfWeek === dayOfWeek
                  )
                ) {
                  return null;
                }

                const classScheduleToShow = classScheduleRow.find(
                  (classSchedule) => classSchedule.dayOfWeek === dayOfWeek
                );

                if (
                  !classScheduleToShow ||
                  classScheduleToShow.status === GenericStatus.inactive
                ) {
                  return <td key={dayOfWeek}>-</td>;
                }

                const scheduledDisciplineName = otherDisciplinesSchedule.find(
                  (disciplineSchedule) =>
                    disciplineSchedule.schedules.some(
                      (schedule) => schedule.guid === classScheduleToShow.guid
                    )
                )?.disciplineName;

                return (
                  <DisciplineScheduleCell
                    key={classScheduleToShow.guid}
                    disableSelection={disableSelection}
                    isSelected={selectedSchedules.some(
                      (selectedSchedule) =>
                        selectedSchedule.guid === classScheduleToShow.guid
                    )}
                    isEducatorBusy={otherPeriodSchedules.some(
                      (otherPeriodSchedule) =>
                        otherPeriodSchedule.guid === classScheduleToShow.guid
                    )}
                    scheduledDisciplineName={scheduledDisciplineName}
                    classSchedule={classScheduleToShow}
                    onSelect={() => onSelect(classScheduleToShow)}
                    onUnselect={() =>
                      onUnselect(classScheduleToShow.guid as string)
                    }
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
