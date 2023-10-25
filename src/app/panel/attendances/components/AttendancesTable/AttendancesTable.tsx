'use client';

import { EditOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
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

interface AttendancesTableProps {
  attendances: Discipline[];
  onEdit: (discipline: Discipline) => void;
}

export const AttendancesTable: React.FC<AttendancesTableProps> = ({
  attendances,
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
              title: 'Data',
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
              ),
            },
          ]}
          dataSource={attendances}
        />
      </TableContainer>
    </ClientComponentLoader>
  );
};
