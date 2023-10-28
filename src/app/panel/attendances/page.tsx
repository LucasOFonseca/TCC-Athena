'use client';

import { PlusOutlined } from '@ant-design/icons';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { attendanceLogService } from '@services/attendanceLog';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { AttendanceDialogForm } from './components/AttendanceDialogForm';
import { AttendancesTable } from './components/AttendancesTable';
import { PageHeader } from './components/PageHeader';

export default function AttendancesPage() {
  const [page, setPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');

  const { data } = useQuery(
    ['attendanceLogs', selectedPeriod, selectedDiscipline, page],
    {
      queryFn: () =>
        attendanceLogService.getByPeriodAndDiscipline(
          selectedPeriod,
          selectedDiscipline,
          page
        ),
      staleTime: Infinity,
      enabled: !!selectedPeriod && !!selectedDiscipline,
    }
  );

  const [attendanceToEditGuid, setAttendanceToEditGuid] = useState<string>();
  const [showAttendanceDialogForm, setShowAttendanceDialogForm] =
    useState(false);

  const handleOpenAttendanceDialogForm = (guid?: string) => {
    if (guid) setAttendanceToEditGuid(guid);

    setShowAttendanceDialogForm(true);
  };

  const handleCloseAttendanceDialogForm = () => {
    setShowAttendanceDialogForm(false);

    if (attendanceToEditGuid) {
      setAttendanceToEditGuid(undefined);
    }
  };

  return (
    <>
      <AttendanceDialogForm
        open={showAttendanceDialogForm}
        selectedPeriod={selectedPeriod}
        selectedDiscipline={selectedDiscipline}
        attendanceToEditGuid={attendanceToEditGuid}
        onClose={handleCloseAttendanceDialogForm}
      />

      <PageHeader
        selectedPeriod={selectedPeriod}
        selectedDiscipline={selectedDiscipline}
        handleChangeDiscipline={setSelectedDiscipline}
        handleChangePeriod={setSelectedPeriod}
      />

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
