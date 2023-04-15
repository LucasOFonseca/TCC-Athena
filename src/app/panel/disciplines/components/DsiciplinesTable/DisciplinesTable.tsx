'use client';

import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Table, Tooltip } from 'antd';
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
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      disciplineService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['disciplines']);
    },
  });

  const handleChangeStatus = (guid: string, status: GenericStatus) => {
    confirm({
      centered: true,
      title: `Alterar status para ${
        status === GenericStatus.active ? '"inativo"' : '"ativo"'
      }?`,
      icon: <ExclamationCircleOutlined />,
      content: `Após confirmar o cadastro ficará ${
        status === GenericStatus.active
          ? 'indisponível para uso até que o status retorne para "ativo".'
          : 'disponível para uso.'
      }`,
      okText: 'Alterar',
      cancelButtonProps: {
        danger: true,
      },
      onOk() {
        changeStatus.mutate({
          guid,
          status:
            status === GenericStatus.active
              ? GenericStatus.inactive
              : GenericStatus.active,
        });
      },
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
                      handleChangeStatus(record.guid as string, record.status)
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
            expandedRowRender: ({ workload, syllabus }) => (
              <div style={{ paddingLeft: 8 }}>
                <span>
                  <strong>Carga horária:</strong>{' '}
                  {`${workload} hora${workload > 1 ? 's' : ''}`}
                </span>

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
