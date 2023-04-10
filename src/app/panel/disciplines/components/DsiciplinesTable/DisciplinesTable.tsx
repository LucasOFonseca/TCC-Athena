'use client';

import { EditOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { StatusButton } from '@components/StatusButton';
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

interface DisciplinesTableProps {
  disciplines: Discipline[];
}

export const DisciplinesTable: React.FC<DisciplinesTableProps> = ({
  disciplines,
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
                  <StatusButton currentStatus={record.status} />

                  <Tooltip placement="bottom" title="Editar">
                    <Button
                      size="middle"
                      shape="circle"
                      type="text"
                      style={{ marginLeft: 8 }}
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
