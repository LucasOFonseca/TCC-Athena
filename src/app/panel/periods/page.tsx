'use client';

import { PlusOutlined } from '@ant-design/icons';
import { PeriodStatus } from '@athena-types/period';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { periodService } from '@services/period';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { EnrolledStudentsDialog } from './components/EnrolledStudentsDialog';
import { PageHeader } from './components/PageHeader';
import { PeriodDialogForm } from './components/PeriodDialogForm';
import { PeriodsTable } from './components/PeriodsTable';

export default function PeriodsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PeriodStatus | 'all'>('all');

  const { data } = useQuery(['periods', page, statusFilter, search], {
    queryFn: () =>
      periodService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [periodToEditGuid, setPeriodToEditGuid] = useState<string>();
  const [editScheduleOnly, setEditScheduleOnly] = useState(false);
  const [showPeriodDialogForm, setShowPeriodDialogForm] = useState(false);

  const [seeEnrollmentsInReadOnlyMode, setSeeEnrollmentsInReadOnlyMode] =
    useState(false);
  const [periodToSeeEnrollments, setPeriodToSeeEnrollments] =
    useState<string>();
  const [showEnrolledStudentsDialogForm, setShowEnrolledStudentsDialogForm] =
    useState(false);

  const handleOpenEnrolledStudentsDialogForm = (
    guid: string,
    readOnly?: boolean
  ) => {
    if (readOnly) {
      setSeeEnrollmentsInReadOnlyMode(true);
    }

    setPeriodToSeeEnrollments(guid);
    setShowEnrolledStudentsDialogForm(true);
  };

  const handleCloseEnrolledStudentsDialogForm = () => {
    setShowEnrolledStudentsDialogForm(false);
    setPeriodToSeeEnrollments(undefined);

    if (seeEnrollmentsInReadOnlyMode) {
      setSeeEnrollmentsInReadOnlyMode(false);
    }
  };

  const handleOpenPeriodDialogForm = (
    guid?: string,
    editScheduleOnly?: boolean
  ) => {
    if (guid) {
      setPeriodToEditGuid(guid);
    }

    if (editScheduleOnly) {
      setEditScheduleOnly(true);
    }

    setShowPeriodDialogForm(true);
  };

  const handleClosePeriodDialogForm = () => {
    setShowPeriodDialogForm(false);

    if (periodToEditGuid) {
      setPeriodToEditGuid(undefined);
    }

    setEditScheduleOnly(false);
  };

  return (
    <>
      <PeriodDialogForm
        open={showPeriodDialogForm}
        editScheduleOnly={editScheduleOnly}
        periodToEditGuid={periodToEditGuid}
        onClose={handleClosePeriodDialogForm}
      />

      <EnrolledStudentsDialog
        open={showEnrolledStudentsDialogForm}
        readOnly={seeEnrollmentsInReadOnlyMode}
        periodGuid={periodToSeeEnrollments}
        onClose={handleCloseEnrolledStudentsDialogForm}
      />

      <PageHeader
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <PeriodsTable
        periods={data?.data ?? []}
        onEdit={handleOpenPeriodDialogForm}
        onSeeEnrollments={handleOpenEnrolledStudentsDialogForm}
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
          tooltip="Abrir novo período"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenPeriodDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
