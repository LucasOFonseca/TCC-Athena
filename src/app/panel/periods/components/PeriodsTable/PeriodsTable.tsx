'use client';

import {
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PeriodStatus, SimplifiedPeriod } from '@athena-types/period';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { useChangeStatusConfirmation } from '@helpers/hooks';
import { getPeriodStatusProps, translateDayOfWeek } from '@helpers/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { disciplineService } from '../../../../../services/discipline';

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
  onEdit: (guid: string) => void;
}

export const PeriodsTable: React.FC<PeriodsTableProps> = ({
  periods,
  onEdit,
}) => {
  const { confirm } = Modal;
  const queryClient = useQueryClient();
  const handleChangeStatus = useChangeStatusConfirmation();

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      disciplineService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['disciplines']);
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
      onOk: () => {},
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
                <>
                  <Tooltip placement="bottom" title="Ver alunos matriculados">
                    <Button
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() => onEdit(record.guid)}
                    >
                      <TeamOutlined />
                    </Button>
                  </Tooltip>

                  {record.status !== PeriodStatus.canceled &&
                  record.status !== PeriodStatus.finished ? (
                    <>
                      <Tooltip placement="bottom" title="Editar">
                        <Button
                          size="middle"
                          shape="circle"
                          type="text"
                          style={{ marginLeft: 8 }}
                          onClick={() => onEdit(record.guid)}
                        >
                          <EditOutlined />
                        </Button>
                      </Tooltip>

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
                    </>
                  ) : null}
                </>
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
