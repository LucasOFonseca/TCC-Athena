'use client';

import { FormOutlined } from '@ant-design/icons';
import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { useChangeStatusConfirmation } from '@helpers/hooks';
import { allDaysOfWeek, translateDayOfWeek } from '@helpers/utils';
import { classScheduleService } from '@services/classSchedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip } from 'antd';
import styled from 'styled-components';
import { ClassScheduleCell } from './components/ClassScheduleCell';

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

        &:last-of-type {
          width: 70px;
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

interface ClassSchedulesMatrixProps {
  classSchedules: ClassSchedule[][];
  onEdit: (schedules: ClassSchedule[]) => void;
}

export const ClassSchedulesMatrix: React.FC<ClassSchedulesMatrixProps> = ({
  classSchedules,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const handleChangeStatus = useChangeStatusConfirmation();

  const allClassSchedules = classSchedules.flat();

  const changeStatus = useMutation({
    mutationFn: ({ guid, status }: any) =>
      classScheduleService.changeStatus(guid, status),
    onSuccess: () => {
      queryClient.invalidateQueries([
        'shifts',
        allClassSchedules[0].shiftGuid,
        'classSchedules',
      ]);
    },
  });

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

            <th />
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

                if (!classScheduleToShow) {
                  return <td key={dayOfWeek}>-</td>;
                }

                return (
                  <ClassScheduleCell
                    key={classScheduleToShow.guid}
                    classSchedule={classScheduleToShow}
                    onChangeStatus={(guid, status) =>
                      handleChangeStatus(status, () => {
                        changeStatus.mutate({
                          guid,
                          status:
                            status === GenericStatus.active
                              ? GenericStatus.inactive
                              : GenericStatus.active,
                        });
                      })
                    }
                    onEdit={onEdit}
                  />
                );
              })}

              <td>
                <Tooltip placement="bottom" title="Editar linha">
                  <Button
                    size="large"
                    shape="circle"
                    type="text"
                    onClick={() => onEdit(classScheduleRow)}
                  >
                    <FormOutlined />
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
