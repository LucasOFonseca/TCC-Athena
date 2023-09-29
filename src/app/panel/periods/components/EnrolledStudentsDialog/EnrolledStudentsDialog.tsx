import { PlusOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { periodService } from '@services/period';
import { studentService } from '@services/student';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Modal, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { EnrolledStudentsTable } from './components/EnrolledStudentsTable';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 32px);
    padding: 0;

    .ant-modal-title {
      padding: 24px 16px 0;
    }

    .ant-modal-body {
      padding: 8px 16px;
      overflow-y: auto;
    }

    .ant-modal-footer {
      padding: 8px 16px 16px;
      margin-top: 0;
    }
  }

  @media (max-width: 600px) {
    max-width: unset;
    width: 100% !important;
    height: 100%;

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 0;
      padding: 0;

      & > button {
        top: 24px;
      }

      .ant-modal-title {
        padding: 24px 16px 0;
      }

      .ant-modal-body {
        height: 100%;
        padding: 8px 16px;
        overflow-y: auto;
      }

      .ant-modal-footer {
        padding: 8px 16px 16px;
        margin-top: 0;
      }
    }
  }
`;

const StudentsSelectContainer = styled(Form.Item)`
  margin-bottom: 8px;

  & > div {
    display: block;
  }
`;

interface EnrolledStudentsDialogProps {
  open: boolean;
  readOnly?: boolean;
  periodGuid?: string;
  onClose: () => void;
}

export const EnrolledStudentsDialog: React.FC<EnrolledStudentsDialogProps> = ({
  open,
  readOnly,
  periodGuid,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { addProgressIndicatorItem, removeProgressIndicatorItem } =
    useProgressIndicator();

  const [search, setSearch] = useState('');

  const { data: studentsData, isLoading } = useQuery(
    ['students', 1, 'active', search],
    {
      queryFn: () =>
        studentService.getPaginated({
          filterByStatus: GenericStatus.active,
          query: search,
        }),
      staleTime: Infinity,
    }
  );

  const { data: enrollments, isFetching: isFetchingEnrollments } = useQuery({
    queryKey: ['periodEnrollments', periodGuid],
    queryFn: () => periodService.getEnrollments(periodGuid ?? ''),
    staleTime: Infinity,
    enabled: !!periodGuid,
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const enrollStudents = useMutation({
    mutationFn: (params: any) =>
      periodService.enrollStudents(params.guid, params.students),
    onSuccess: () => {
      queryClient.invalidateQueries(['periodEnrollments', periodGuid]);
      setSelectedStudents([]);
    },
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value === '' || value.length >= 3) {
        setSearch(value);
      }
    }, 500),
    []
  );

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (isFetchingEnrollments) {
      addProgressIndicatorItem({
        id: 'fetch-period-enrollments',
        message: 'Obtendo alunos matriculados...',
      });

      return;
    }

    removeProgressIndicatorItem('fetch-period-enrollments');
  }, [isFetchingEnrollments]);

  return (
    <StyledModal
      centered
      destroyOnClose
      width={650}
      open={open}
      onCancel={handleCancel}
      title="Alunos matriculados"
      footer={null}
    >
      {!readOnly && (
        <>
          <StudentsSelectContainer label="Alunos para matricular">
            <Select
              showSearch
              mode="multiple"
              size="large"
              placeholder="Selecione os alunos que gostaria de matricular"
              optionFilterProp="children"
              loading={isLoading}
              value={selectedStudents}
              onChange={(values) => setSelectedStudents(values)}
              options={studentsData?.data
                ?.filter(
                  (student) =>
                    !enrollments?.some(
                      (enrollment) => enrollment.studentGuid === student.guid
                    )
                )
                .map((student) => ({
                  label: student.name,
                  value: student.guid,
                }))}
              filterOption={(input, option) =>
                includesIgnoreDiacritics(option?.label ?? '', input)
              }
              onSearch={(value) => debouncedSearch(value)}
            />
          </StudentsSelectContainer>

          <Button
            block
            disabled={selectedStudents.length === 0}
            size="middle"
            icon={<PlusOutlined />}
            onClick={() =>
              enrollStudents.mutate({
                guid: periodGuid,
                students: selectedStudents,
              })
            }
          >
            Matricular alunos
          </Button>
        </>
      )}

      {enrollments && enrollments.length > 0 ? (
        <EnrolledStudentsTable
          readOnly={readOnly ?? false}
          periodGuid={periodGuid ?? ''}
          enrollments={enrollments}
        />
      ) : (
        <Empty description="Não há alunos matriculados" />
      )}
    </StyledModal>
  );
};
