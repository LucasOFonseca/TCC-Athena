import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { DisciplineSchedule } from '@athena-types/period';
import { allDaysOfWeek, translateDayOfWeek } from '@helpers/utils';
import dayjs from 'dayjs';
import styled from 'styled-components';

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

const ScheduleCell = styled.td`
  height: 80px;
  vertical-align: baseline;
  padding: 8px;
`;

interface EmployeeSchedulesMatrixProps {
  employeeSchedules: DisciplineSchedule[];
  classSchedules: ClassSchedule[][];
}

export const EmployeeSchedulesMatrix: React.FC<
  EmployeeSchedulesMatrixProps
> = ({ employeeSchedules, classSchedules }) => {
  const allClassSchedules = classSchedules
    .flat()
    .filter((schedule) => schedule.status === GenericStatus.active);

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

                const scheduledDisciplineName = employeeSchedules.find(
                  (disciplineSchedule) =>
                    disciplineSchedule.schedules.some(
                      (schedule) => schedule.guid === classScheduleToShow.guid
                    )
                )?.disciplineName;

                return (
                  <ScheduleCell
                    key={classScheduleToShow.guid}
                    style={{
                      color: !scheduledDisciplineName
                        ? 'rgba(0, 0, 0, 0.25)'
                        : undefined,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <strong style={{ fontSize: '1rem' }}>
                        {dayjs(classScheduleToShow.startTime).format('HH:mm')} -{' '}
                        {dayjs(classScheduleToShow.endTime).format('HH:mm')}
                      </strong>

                      {scheduledDisciplineName && (
                        <>
                          <p style={{ fontSize: '1rem' }}>
                            <strong>Aula de:</strong> {scheduledDisciplineName}
                          </p>
                        </>
                      )}
                    </div>
                  </ScheduleCell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
