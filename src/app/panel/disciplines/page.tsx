'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { disciplineService } from '@services/discipline';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { DisciplineDialogForm } from './components/DisciplineDialogForm';
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
    staleTime: Infinity,
  });

  const [disciplineToEdit, setDisciplineToEdit] = useState<Discipline>();
  const [showDisciplineDialogForm, setShowDisciplineDialogForm] =
    useState(false);

  const handleOpenDisciplineDialogForm = (discipline?: Discipline) => {
    if (discipline) {
      setDisciplineToEdit(discipline);
    }

    setShowDisciplineDialogForm(true);
  };

  const handleCloseDisciplineDialogForm = () => {
    setShowDisciplineDialogForm(false);

    if (disciplineToEdit) {
      setDisciplineToEdit(undefined);
    }
  };

  return (
    <>
      <DisciplineDialogForm
        open={showDisciplineDialogForm}
        disciplineToEdit={disciplineToEdit}
        onClose={handleCloseDisciplineDialogForm}
      />

      <PageHeader
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <DisciplinesTable
        disciplines={data?.data ?? []}
        onEdit={handleOpenDisciplineDialogForm}
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
          tooltip="Adicionar nova disciplina"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenDisciplineDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
