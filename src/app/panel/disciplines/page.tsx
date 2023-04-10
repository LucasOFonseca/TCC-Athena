'use client';

import { GenericStatus } from '@athena-types/genericStatus';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'antd';
import { useState } from 'react';
import { disciplineService } from '../../../services/discipline';
import { DisciplinesTable } from './components/DsiciplinesTable';
import { PageHeader } from './components/PageHeader';

export default function DisciplinesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['disciplines', page, statusFilter, search], {
    queryFn: () =>
      disciplineService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
  });

  return (
    <>
      <PageHeader
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <DisciplinesTable disciplines={data?.data ?? []} />

      {data && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Pagination
            hideOnSinglePage
            responsive
            current={page}
            total={data.totalPages * 10}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </>
  );
}
