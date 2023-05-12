'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Employee } from '@athena-types/employee';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { FloatButton, Pagination } from 'antd';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmployeeDialogForm } from './components/EmployeeDialogForm';
import { EmployeesTable } from './components/EmployeesTable';

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GenericStatus | 'all'>(
    'all'
  );

  const { data } = useQuery(['employees', page, statusFilter, search], {
    queryFn: () =>
      employeeService.getPaginated({
        filterByStatus: statusFilter !== 'all' ? statusFilter : undefined,
        query: search,
        page,
      }),
    staleTime: Infinity,
  });

  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>();
  const [showEmployeeDialogForm, setShowEmployeeDialogForm] = useState(false);

  const handleOpenEmployeeDialogForm = (employee?: Employee) => {
    if (employee) {
      setEmployeeToEdit(employee);
    }

    setShowEmployeeDialogForm(true);
  };

  const handleCloseEmployeeDialogForm = () => {
    setShowEmployeeDialogForm(false);
  };

  return (
    <>
      <EmployeeDialogForm
        open={showEmployeeDialogForm}
        employeeToEdit={employeeToEdit}
        onClose={handleCloseEmployeeDialogForm}
      />

      <PageHeader
        title="Colaboradores"
        statusFilter={statusFilter}
        onChangeSearch={(value) => setSearch(value)}
        onChangeStatusFilter={(value) => setStatusFilter(value)}
      />

      <EmployeesTable
        employees={data?.data ?? []}
        onEdit={handleOpenEmployeeDialogForm}
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
          tooltip="Cadastrar colaborador"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenEmployeeDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
