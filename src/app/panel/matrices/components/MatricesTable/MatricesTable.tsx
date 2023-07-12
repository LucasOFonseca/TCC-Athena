'use client';

import { EditOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { MatrixBase } from '@athena-types/matrix';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
import { useChangeStatusConfirmation } from '@helpers/hooks';
import { matrixService } from '@services/matrix';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Tooltip } from 'antd';
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

interface MatricesTableProps {
  matrices: MatrixBase[];
  onEdit: (guid: string) => void;
}

export const MatricesTable: React.FC<MatricesTableProps> = ({
  matrices,
  onEdit,
}) => {
  const queryClient = useQueryClient();
  const handleChangeStatus = useChangeStatusConfirmation();

  const changeStatus = useMutation({
    mutationFn: (params: any) =>
      matrixService.changeStatus(params.guid, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries(['matrices']);
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
              title: 'Curso/Matriz',
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
                      onClick={() => onEdit(record.guid)}
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                </>
              ),
            },
          ]}
          dataSource={matrices}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
