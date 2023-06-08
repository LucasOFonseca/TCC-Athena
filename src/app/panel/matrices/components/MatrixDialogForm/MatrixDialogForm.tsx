'use client';

import { Course } from '@athena-types/course';
import { CreateMatrixRequestData, Matrix } from '@athena-types/matrix';
import { ErrorMessages } from '@athena-types/messages';
import { matrixService } from '@services/matrix';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { CourseSelect } from './components/CourseSelect';
import { ModulesList } from './components/ModulesList';

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
      max-height: 100%;
      height: 100%;
      border-radius: 0;

      & > button {
        top: 24px;
      }

      .ant-modal-body {
        height: 100%;
      }
    }
  }
`;

interface MatrixDialogFormProps {
  open: boolean;
  matrixToEdit?: Matrix;
  onClose: () => void;
}

export const MatrixDialogForm: React.FC<MatrixDialogFormProps> = ({
  open,
  matrixToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<Matrix>();

  const { resetFields, setFieldsValue, validateFields } = form;

  const createMatrix = useMutation({
    mutationFn: (data: CreateMatrixRequestData) => matrixService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'matrices' &&
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
          queryKey[0] === 'matrices' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editMatrix = useMutation({
    mutationFn: (data: Matrix) => matrixService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'matrices' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Course) => item.guid === updatedData.guid
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
          queryKey[0] === 'matrices' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    if (createMatrix.isLoading || editMatrix.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        const dataToSend = {
          ...data,
          modules: data.modules.map((module, index) => ({
            ...module,
            name: !module.name ? `Módulo ${index + 1}` : module.name,
          })),
        };

        if (matrixToEdit) {
          editMatrix
            .mutateAsync({
              ...matrixToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createMatrix
            .mutateAsync(dataToSend)
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
    if (matrixToEdit) {
      setFieldsValue({
        name: matrixToEdit.name,
      });
    }
  }, [matrixToEdit]); // eslint-disable-line

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${matrixToEdit ? 'Editar' : 'Adicionar'} matriz`}
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
          loading={createMatrix.isLoading || editMatrix.isLoading}
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
        disabled={createMatrix.isLoading || editMatrix.isLoading}
        form={form}
        initialValues={{
          name: '',
          modules: [
            {
              name: '',
              disciplines: [
                {
                  name: '',
                },
              ],
            },
          ],
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
          <Input size="large" placeholder="Dê um nome para a matriz" />
        </Form.Item>

        <CourseSelect />

        <ModulesList form={form} />
      </Form>
    </StyledModal>
  );
};
