'use client';

import { PlusOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Student } from '@athena-types/student';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { studentService } from '@services/student';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StudentDialogForm } from './components/StudentDialogForm';
import { StudentsTable } from './components/StudentsTable';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['students', page, statusFilter, search], {
    queryFn: () =>
      studentService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [studentToEdit, setStudentToEdit] = useState<Student>();
  const [showStudentDialogForm, setShowStudentDialogForm] = useState(false);

  const handleOpenStudentDialogForm = (student?: Student) => {
    if (student) {
      setStudentToEdit(student);
    }

    setShowStudentDialogForm(true);
  };

  const handleCloseStudentDialogForm = () => {
    setShowStudentDialogForm(false);

    if (studentToEdit) {
      setStudentToEdit(undefined);
    }
  };

  return (
    <>
      <StudentDialogForm
        open={showStudentDialogForm}
        studentToEdit={studentToEdit}
        onClose={handleCloseStudentDialogForm}
      />

      <PageHeader
        title="Alunos"
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <StudentsTable
        students={data?.data ?? []}
        onEdit={handleOpenStudentDialogForm}
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
          tooltip="Cadastrar aluno"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenStudentDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
