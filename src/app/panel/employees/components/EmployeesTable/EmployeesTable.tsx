import { EditOutlined, MailOutlined } from '@ant-design/icons';
import { Employee } from '@athena-types/employee';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { useChangeStatusConfirmation } from '@helpers/hooks';
import { formatCpf, formatPhoneNumber, getRoleProps } from '@helpers/utils';
import { employeeService } from '@services/employee';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Table, Tag, Tooltip } from 'antd';
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

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const handleChangeStatus = useChangeStatusConfirmation();

  const { addProgressIndicatorItem, removeProgressIndicatorItem } =
    useProgressIndicator();

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      employeeService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });

  const handleResetPassword = (guid: string) => {
    addProgressIndicatorItem({
      id: 'reset-password',
      message: 'Reenviando e-mail...',
    });

    employeeService.resetPassword(guid).finally(() => {
      removeProgressIndicatorItem('reset-password');
    });
  };

  return (
    <ClientComponentLoader>
      <TableContainer>
        <Table
          size="small"
          rowKey="guid"
          pagination={false}
          dataSource={employees}
          columns={[
            {
              title: 'Nome',
              dataIndex: 'name',
              key: 'name',
              align: 'left',
            },
            {
              title: 'Atribuições',
              dataIndex: 'roles',
              key: 'roles',
              align: 'left',
              render: (_, record) => (
                <div style={{ display: 'flex', gap: 8 }}>
                  {record.roles.map((role) => {
                    const roleProps = getRoleProps(role);

                    return (
                      <Tag
                        key={role}
                        color={roleProps.color}
                        style={{ textTransform: 'uppercase', fontWeight: 700 }}
                      >
                        {roleProps.translated}
                      </Tag>
                    );
                  })}
                </div>
              ),
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
