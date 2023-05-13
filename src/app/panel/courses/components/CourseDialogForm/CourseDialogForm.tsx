'use client';

import { Course, CreateCourseRequestData } from '@athena-types/course';
import { Discipline } from '@athena-types/discipline';
import { ErrorMessages } from '@athena-types/messages';
import { courseService } from '@services/course';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const StyledModal = styled(Modal)`
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

interface CourseDialogFormProps {
  open: boolean;
  courseToEdit?: Course;
  onClose: () => void;
}

export const CourseDialogForm: React.FC<CourseDialogFormProps> = ({
  open,
  courseToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<Course>();

  const { resetFields, setFieldsValue, validateFields } = form;

  const createCourse = useMutation({
    mutationFn: (data: CreateCourseRequestData) => courseService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'courses' &&
            (queryKey[1] as number) === 1 &&
            (queryKey[2] === 'all' || queryKey[2] === 'active') &&
            queryKey[3] === '',
        },
        (data: any) => {
          const newArrayOfData = [newItem, ...data.data];

          if (data.data.length === 10) newArrayOfData.pop();

          return { ...data, data: newArrayOfData };
        }
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === 'courses' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editCourse = useMutation({
    mutationFn: (data: Course) => courseService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'courses' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Discipline) => item.guid === updatedData.guid
          );

          if (itemIndex === -1) {
            return data;
          }

          const newArrayOfData = [...data.data];

          newArrayOfData[itemIndex] = updatedData;

          return { ...data, data: newArrayOfData };
        }
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === 'courses' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    if (createCourse.isLoading || editCourse.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (courseToEdit) {
          editCourse
            .mutateAsync({
              ...courseToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createCourse
            .mutateAsync(data)
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        Swal.fire('Ops!', ErrorMessages.MSGE01, 'error');
      });
  };

  useEffect(() => {
    if (courseToEdit) {
      setFieldsValue({
        name: courseToEdit.name,
      });
    }
  }, [courseToEdit]); // eslint-disable-line

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${courseToEdit ? 'Editar' : 'Adicionar'} curso`}
      footer={[
        <Button
          danger
          key="cancel"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleCancel}
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          loading={createCourse.isLoading || editCourse.isLoading}
          type="primary"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleSubmit}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        size="middle"
        disabled={createCourse.isLoading || editCourse.isLoading}
        form={form}
        initialValues={{
          name: '',
          syllabus: '',
        }}
      >
        <Form.Item
          required
          label="Nome"
          name="name"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
            { type: 'string', max: 120, message: ErrorMessages.MSGE09 },
          ]}
        >
          <Input size="large" placeholder="Dê um nome para o curso" />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
