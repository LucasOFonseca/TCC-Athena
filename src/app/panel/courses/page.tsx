'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Course } from '@athena-types/course';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { courseService } from '@services/course';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { CourseDialogForm } from './components/CourseDialogForm';
import { CoursesTable } from './components/CoursesTable';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['courses', page, statusFilter, search], {
    queryFn: () =>
      courseService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [courseToEdit, setCourseToEdit] = useState<Course>();
  const [showCourseDialogForm, setShowCourseDialogForm] = useState(false);

  const handleOpenCourseDialogForm = (course?: Course) => {
    if (course) {
      setCourseToEdit(course);
    }

    setShowCourseDialogForm(true);
  };

  const handleCloseCourseDialogForm = () => {
    setShowCourseDialogForm(false);

    if (courseToEdit) {
      setCourseToEdit(undefined);
    }
  };

  return (
    <>
      <CourseDialogForm
        open={showCourseDialogForm}
        courseToEdit={courseToEdit}
        onClose={handleCloseCourseDialogForm}
      />

      <PageHeader
        title="Cursos"
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <CoursesTable
        courses={data?.data ?? []}
        onEdit={handleOpenCourseDialogForm}
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
          onClick={() => handleOpenCourseDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
