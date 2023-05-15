import {
  EditOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Student } from '@athena-types/student';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { formatCpf, formatPhoneNumber } from '@helpers/utils';
import { studentService } from '@services/student';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Modal, Table, Tooltip } from 'antd';
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

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const { addProgressIndicatorItem, removeProgressIndicatorItem } =
    useProgressIndicator();

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      studentService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });

  const handleResetPassword = (guid: string) => {
    addProgressIndicatorItem({
      id: 'reset-password',
      message: 'Reenviando e-mail...',
    });

    studentService.resetPassword(guid).finally(() => {
      removeProgressIndicatorItem('reset-password');
    });
  };

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
          dataSource={students}
          columns={[
            {
              title: 'Nome',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              dataIndex: 'actions',
              key: 'actions',
              width: 190,
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

                  <Tooltip placement="bottom" title="Reenviar dados de acesso">
                    <Button
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleResetPassword(record.guid as string)}
                    >
                      <MailOutlined />
                    </Button>
                  </Tooltip>
                </>
              ),
            },
          ]}
          expandable={{
            expandedRowRender: ({
              cpf,
              address,
              birthdate,
              email,
              phoneNumber,
            }) => (
              <div style={{ paddingLeft: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 48,
                    paddingTop: 8,
                  }}
                >
                  <p>
                    <strong>CPF:</strong> {formatCpf(cpf)}
                  </p>

                  <p>
                    <strong>Data de nascimento:</strong>{' '}
                    {dayjs(birthdate).format('DD/MM/YYYY')}
                  </p>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div>
                  <strong>Contatos</strong>

                  <p>
                    <strong>E-mail:</strong> {email}
                  </p>

                  <p>
                    <strong>Telefone:</strong> {formatPhoneNumber(phoneNumber)}
                  </p>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <p>
                  <strong>Endereço:</strong>{' '}
                  {`${address.street}, ${address.number}, ${address.neighborhood}, ${address.city} - ${address.state}`}
                </p>
              </div>
            ),
          }}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
