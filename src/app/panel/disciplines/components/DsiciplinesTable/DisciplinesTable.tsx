'use client';

import { EditOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { useChangeStatusConfirmation } from '@helpers/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Tooltip } from 'antd';
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

interface DisciplinesTableProps {
  disciplines: Discipline[];
  onEdit: (discipline: Discipline) => void;
}

export const DisciplinesTable: React.FC<DisciplinesTableProps> = ({
  disciplines,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const handleChangeStatus = useChangeStatusConfirmation();

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      disciplineService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['disciplines']);
    },
  });

  return (
    <ClientComponentLoader>
      <TableContainer>
        <Table
          size="small"
          rowKey="guid"
          pagination={false}
          columns={[
            {
              title: 'Disciplina',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              dataIndex: 'actions',
              key: 'actions',
              width: 150,
              align: 'right',
              render: (_, record) => (
                <>
                  <StatusButton
                    currentStatus={record.status}
                    onClick={() =>
                      handleChangeStatus(record.status, () => {
                        changeStatus.mutate({
                          guid: record.guid,
                          status:
                            record.status === GenericStatus.active
                              ? GenericStatus.inactive
                              : GenericStatus.active,
                        });
                      })
                    }
                  />

                  <Tooltip placement="bottom" title="Editar">
                    <Button
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() => onEdit(record)}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                </>
              ),
            },
          ]}
          dataSource={disciplines}
          expandable={{
            expandedRowRender: ({ workload, syllabus, weeklyClasses }) => (
              <div style={{ paddingLeft: 8 }}>
                <div style={{ display: 'flex', gap: 32 }}>
                  <span>
                    <strong>Carga horária:</strong>{' '}
                    {`${workload} hora${workload > 1 ? 's' : ''}`}
                  </span>

                  <span>
                    <strong>Aulas por semana:</strong> {weeklyClasses}
                  </span>
                </div>

                <div style={{ marginTop: 16 }}>
                  <strong>Ementa</strong>

                  <p>{syllabus}</p>
                </div>
              </div>
            ),
          }}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
