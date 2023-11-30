'use client';

import {
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PeriodStatus, SimplifiedPeriod } from '@athena-types/period';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { getPeriodStatusProps, translateDayOfWeek } from '@helpers/utils';
import { periodService } from '@services/period';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

const TableContainer = styled.div`
  border-radius: 8px;
  overflow: auto;
  min-height: 529px;

  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15));

  & > div {
    min-width: 750px;

    thead tr th::before {
      display: none;
    }
  }
`;

const StatusChip = styled.div`
  height: 20px;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 0.75rem;
  background-color: ${({ color }) => color};
  padding: 0 4px;
  border-radius: 10px;
  margin-left: auto;
`;

const DisciplineScheduleItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;

  & p:first-of-type {
    font-weight: 700;
  }

  & + & {
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
  }
`;

interface PeriodsTableProps {
  periods: SimplifiedPeriod[];
  onEdit: (guid?: string, editScheduleOnly?: boolean) => void;
  onSeeEnrollments: (guid: string, readOnly?: boolean) => void;
}

export const PeriodsTable: React.FC<PeriodsTableProps> = ({
  periods,
  onEdit,
  onSeeEnrollments,
}) => {
  const { confirm } = Modal;
  const queryClient = useQueryClient();

  const cancelPeriod = useMutation({
    mutationFn: (guid: string) => periodService.cancel(guid),
    onSuccess: () => {
      queryClient.invalidateQueries(['periods']);
    },
  });

  const handleCancelPeriod = (guid: string) => {
    confirm({
      centered: true,
      title: 'Deseja cancelar o período?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Após confirmar, o período será cancelado. Esta ação não poderá ser desfeita!',
      okText: 'Confirmar',
      cancelText: 'Voltar',
      cancelButtonProps: {
        danger: true,
      },
      onOk: () => cancelPeriod.mutate(guid),
    });
  };

  return (
    <ClientComponentLoader>
      <TableContainer>
        <Table
          size="small"
          rowKey="guid"
          pagination={false}
          columns={[
            {
              title: 'Nome',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              dataIndex: 'status',
              key: 'status',
              align: 'right',
              render: (_, { status }) => {
                const { color, icon, translated } =
                  getPeriodStatusProps(status);

                return (
                  <>
                    <StatusChip color={color}>
                      {icon} {translated}
                    </StatusChip>
                  </>
                );
              },
            },
            {
              dataIndex: 'actions',
              key: 'actions',
              width: 140,
              align: 'left',
              render: (_, record) => (
                <div style={{ display: 'flex' }}>
                  <Tooltip placement="bottom" title="Ver alunos matriculados">
                    <Button
                      disabled={
                        record.status === PeriodStatus.draft ||
                        record.status === PeriodStatus.notStarted
                      }
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() =>
                        onSeeEnrollments(
                          record.guid,
                          record.status !== PeriodStatus.openForEnrollment &&
                            record.status !== PeriodStatus.inProgress
                        )
                      }
                    >
                      <TeamOutlined />
                    </Button>
                  </Tooltip>

                  <Tooltip placement="bottom" title="Editar cronograma">
                    <Button
                      disabled={
                        record.status === PeriodStatus.draft ||
                        record.status === PeriodStatus.finished ||
                        record.status === PeriodStatus.canceled
                      }
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() => onEdit(record.guid, true)}
                    >
                      <ClockCircleOutlined />
                    </Button>
                  </Tooltip>

                  <Tooltip placement="bottom" title="Editar">
                    <Button
                      disabled={
                        record.status === PeriodStatus.finished ||
                        record.status === PeriodStatus.canceled
                      }
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() => onEdit(record.guid)}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>

                  {record.status === PeriodStatus.draft ||
                  record.status === PeriodStatus.notStarted ? (
                    <Tooltip placement="bottom" title="Cancelar período">
                      <Button
                        danger
                        size="middle"
                        shape="circle"
                        type="text"
                        style={{ marginLeft: 8 }}
                        onClick={() =>
                          handleCancelPeriod(record.guid as string)
                        }
                      >
                        <CloseOutlined />
                      </Button>
                    </Tooltip>
                  ) : null}
                </div>
              ),
            },
          ]}
          dataSource={periods}
          expandable={{
            expandedRowRender: ({ disciplinesSchedule }) => (
              <div style={{ paddingLeft: 8 }}>
                {disciplinesSchedule?.map((disciplineSchedule) => (
                  <DisciplineScheduleItem key={disciplineSchedule.guid}>
                    <p>{disciplineSchedule.name}</p>

                    <p>
                      <strong>Professor:</strong> {disciplineSchedule.educator}
                    </p>

                    <p>
                      <strong>Aulas: </strong>{' '}
                      {disciplineSchedule.schedules
                        .map(
                          (s) =>
                            `${translateDayOfWeek(s.dayOfWeek, true)} (${dayjs(
                              s.startTime
                            ).format('HH:mm')} - ${dayjs(s.endTime).format(
                              'HH:mm'
                            )})`
                        )
                        .join(', ')}
                    </p>
                  </DisciplineScheduleItem>
                ))}
              </div>
            ),
          }}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
