import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { PeriodForm } from '@athena-types/period';
import { ShiftType } from '@athena-types/shift';
import { Print } from '@components/print';
import {
  allDaysOfWeek,
  translateDayOfWeek,
  translateShift,
} from '@helpers/utils';
import { periodService } from '@services/period';
import { shiftService } from '@services/shift';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border: 1px solid #000;

  thead {
    tr {
      th {
        width: 200px;
        padding: 8px;
        text-align: center;
        text-transform: capitalize;
        border-bottom: 1px solid #000;

        &:not(:first-of-type) {
          border-left: 1px solid #000;
        }

        &:first-of-type {
          max-width: 100px;
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
        border-left: 1px solid #000;
      }

      &:not(:last-of-type) {
        td {
          border-bottom: 1px solid #000;
        }
      }
    }
  }
`;

const Cell = styled.td`
  height: 80px;
  text-align: start !important;
  vertical-align: baseline;
  padding: 8px;
`;

interface PeriodSchedulePrintProps {
  ref?: React.Ref<HTMLDivElement>;
  periodGuid: string;
  period: PeriodForm;
}

const PeriodSchedulePrint: React.FC<PeriodSchedulePrintProps> = forwardRef(
  ({ period, periodGuid }, ref) => {
    const { data: classSchedules } = useQuery(
      ['shifts', period.shiftGuid, 'classSchedules'],
      {
        queryFn: () => shiftService.getClassSchedules(period.shiftGuid ?? ''),
        enabled: !!period.shiftGuid,
        staleTime: Infinity,
      }
    );

    const { data: shifts } = useQuery(['shifts'], {
      queryFn: () => shiftService.getAll(),
      staleTime: Infinity,
    });

    const { data: simplifiedPeriod } = useQuery({
      queryKey: ['simplifiedPeriod', period.guid],
      queryFn: () => periodService.getSimplified(periodGuid),
      staleTime: Infinity,
      enabled: !!periodGuid,
    });

    const [allClassSchedules, setAllClassSchedules] = useState<ClassSchedule[]>(
      []
    );

    useEffect(() => {
      if (!classSchedules) return;

      setAllClassSchedules(
        classSchedules
          .flat()
          .filter((schedule) => schedule.status === GenericStatus.active)
      );
    }, [classSchedules]);

    return (
      <Print.Container ref={ref}>
        <Print.Header />

        <Print.Content>
          <h5
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            cronograma
          </h5>

          <h6
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            {simplifiedPeriod?.name} -{' '}
            {translateShift(
              shifts?.find((s) => s.guid === period.shiftGuid)?.shift ||
                ShiftType.morning
            )}
          </h6>

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
              {classSchedules?.map((classScheduleRow) => (
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

                    const disciplineScheduleInfo =
                      period.disciplinesSchedule?.find((disciplineSchedule) =>
                        disciplineSchedule.schedules.some(
                          (schedule) =>
                            schedule.guid === classScheduleToShow.guid
                        )
                      );

                    return (
                      <Cell key={dayOfWeek}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <strong>
                            {dayjs(classScheduleToShow.startTime).format(
                              'HH:mm'
                            )}{' '}
                            -{' '}
                            {dayjs(classScheduleToShow.endTime).format('HH:mm')}
                          </strong>
                        </div>

                        {disciplineScheduleInfo && (
                          <>
                            <div style={{ marginTop: 8 }}>
                              <strong>Disciplina:</strong>

                              <p>{disciplineScheduleInfo.disciplineName}</p>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <strong>Professor(a):</strong>

                              <p>{disciplineScheduleInfo.employeeName}</p>
                            </div>
                          </>
                        )}
                      </Cell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Print.Content>

        <Print.Footer />
      </Print.Container>
    );
  }
);

PeriodSchedulePrint.displayName = 'PeriodSchedulePrint';

export { PeriodSchedulePrint };
