'use client';

import { Classroom, CreateClassroomRequestData } from '@athena-types/classroom';
import { ErrorMessages } from '@athena-types/messages';
import { classroomService } from '@services/classroom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
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

interface ClassroomDialogFormProps {
  open: boolean;
  classroomToEdit?: Classroom;
  onClose: () => void;
}

export const ClassroomDialogForm: React.FC<ClassroomDialogFormProps> = ({
  open,
  classroomToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<Classroom>();

  const { resetFields, setFieldsValue, validateFields } = form;

  const createClassroom = useMutation({
    mutationFn: (data: CreateClassroomRequestData) =>
      classroomService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'classrooms' &&
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
          queryKey[0] === 'classrooms' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editClassroom = useMutation({
    mutationFn: (data: Classroom) => classroomService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'classrooms' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Classroom) => item.guid === updatedData.guid
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
          queryKey[0] === 'classrooms' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    if (createClassroom.isLoading || editClassroom.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (classroomToEdit) {
          editClassroom
            .mutateAsync({
              ...classroomToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createClassroom
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
    if (classroomToEdit) {
      setFieldsValue({
        name: classroomToEdit.name,
        capacity: classroomToEdit.capacity,
      });
    }
  }, [classroomToEdit]); // eslint-disable-line

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${classroomToEdit ? 'Editar' : 'Adicionar'} sala de aula`}
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
          loading={createClassroom.isLoading || editClassroom.isLoading}
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
        disabled={createClassroom.isLoading || editClassroom.isLoading}
        form={form}
        initialValues={{
          name: '',
          capacity: 40,
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
          <Input size="large" placeholder="Sala 01" />
        </Form.Item>

        <Form.Item
          required
          label="Capacidade"
          name="capacity"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber
            size="large"
            min={1}
            max={100}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
