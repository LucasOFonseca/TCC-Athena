'use client';

import { EditOutlined } from '@ant-design/icons';
import { SimplifiedAttendanceLog } from '@athena-types/attendanceLog';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { Button, Table, Tooltip } from 'antd';
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

    thead tr th:nth-of-type(2) {
      width: 100%;
      max-width: 1000px;
    }
  }
`;

interface AttendancesTableProps {
  attendances: SimplifiedAttendanceLog[];
  onEdit: (guid: string) => void;
}

export const AttendancesTable: React.FC<AttendancesTableProps> = ({
  attendances,
  onEdit,
}) => {
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
              dataIndex: 'classDate',
              key: 'classDate',
              align: 'left',
              width: 150,
              render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
            },
            {
              title: 'Conteúdo',
              dataIndex: 'classSummary',
              key: 'classSummary',
              align: 'left',
              ellipsis: true,
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
                    onClick={() => onEdit(record.guid)}
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
