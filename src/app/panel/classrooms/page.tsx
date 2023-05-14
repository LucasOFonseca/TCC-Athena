'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Classroom } from '@athena-types/classroom';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { classroomService } from '@services/classroom';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ClassroomDialogForm } from './components/ClassroomDialogForm';
import { ClassroomsTable } from './components/ClassroomsTable';

export default function ClassroomsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['classrooms', page, statusFilter, search], {
    queryFn: () =>
      classroomService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [classroomToEdit, setClassroomToEdit] = useState<Classroom>();
  const [showClassroomDialogForm, setShowClassroomDialogForm] = useState(false);

  const handleOpenClassroomDialogForm = (classroom?: Classroom) => {
    if (classroom) {
      setClassroomToEdit(classroom);
    }

    setShowClassroomDialogForm(true);
  };

  const handleCloseClassroomDialogForm = () => {
    setShowClassroomDialogForm(false);

    if (classroomToEdit) {
      setClassroomToEdit(undefined);
    }
  };

  return (
    <>
      <ClassroomDialogForm
        open={showClassroomDialogForm}
        classroomToEdit={classroomToEdit}
        onClose={handleCloseClassroomDialogForm}
      />

      <PageHeader
        title="Salas de aula"
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <ClassroomsTable
        classrooms={data?.data ?? []}
        onEdit={handleOpenClassroomDialogForm}
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
          tooltip="Adicionar nova sala de aula"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenClassroomDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
