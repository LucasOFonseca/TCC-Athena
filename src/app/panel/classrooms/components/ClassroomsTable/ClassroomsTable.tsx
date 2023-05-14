'use client';

import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Classroom } from '@athena-types/classroom';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { classroomService } from '@services/classroom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Table, Tooltip } from 'antd';
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

interface ClassroomsTableProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
}

export const ClassroomsTable: React.FC<ClassroomsTableProps> = ({
  classrooms,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      classroomService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['classrooms']);
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
              title: 'Sala de aula',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              title: 'Capacidade',
              dataIndex: 'capacity',
              key: 'capacity',
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
          dataSource={classrooms}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
