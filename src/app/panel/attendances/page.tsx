'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Discipline } from '@athena-types/discipline';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { disciplineService } from '@services/discipline';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { AttendanceDialogForm } from './components/AttendanceDialogForm';
import { AttendancesTable } from './components/AttendancesTable';
import { PageHeader } from './components/PageHeader';

export default function AttendancesPage() {
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

  const [attendanceToEdit, setAttendanceToEdit] = useState<Discipline>();
  const [showAttendanceDialogForm, setShowAttendanceDialogForm] =
    useState(false);

  const handleOpenAttendanceDialogForm = (attendance?: Discipline) => {
    if (attendance) {
      setAttendanceToEdit(attendance);
    }

    setShowAttendanceDialogForm(true);
  };

  const handleCloseAttendanceDialogForm = () => {
    setShowAttendanceDialogForm(false);

    if (attendanceToEdit) {
      setAttendanceToEdit(undefined);
    }
  };

  return (
    <>
      <AttendanceDialogForm
        open={showAttendanceDialogForm}
        disciplineToEdit={attendanceToEdit}
        onClose={handleCloseAttendanceDialogForm}
      />

      <PageHeader statusFilter="all" />

      <AttendancesTable
        attendances={data?.data ?? []}
        onEdit={handleOpenAttendanceDialogForm}
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
          tooltip="Novo registro de frequência"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenAttendanceDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
