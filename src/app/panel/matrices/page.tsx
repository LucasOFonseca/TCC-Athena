'use client';

import { PlusOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Matrix } from '@athena-types/matrix';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { matrixService } from '@services/matrix';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { MatricesTable } from './components/MatricesTable';
import { MatrixDialogForm } from './components/MatrixDialogForm';

export default function MatricesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['matrices', page, statusFilter, search], {
    queryFn: () =>
      matrixService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [showMatrixDialogForm, setShowMatrixDialogForm] = useState(false);

  const handleOpenMatrixDialogForm = (matrix?: Matrix) => {
    setShowMatrixDialogForm(true);
  };

  const handleCloseMatrixDialogForm = () => {
    setShowMatrixDialogForm(false);
  };

  return (
    <>
      <MatrixDialogForm
        open={showMatrixDialogForm}
        onClose={handleCloseMatrixDialogForm}
      />

      <PageHeader
        title="Matrizes"
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <MatricesTable
        matrices={data?.data ?? []}
        onEdit={() => handleOpenMatrixDialogForm()}
      />

      {data && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <ClientComponentLoader>
            <Pagination
              hideOnSinglePage
              responsive
              current={page}
              total={data.totalPages * 10}
              onChange={(newPage) => setPage(newPage)}
            />
          </ClientComponentLoader>
        </div>
      )}

      <ClientComponentLoader>
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="Criar nova matriz"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenMatrixDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
