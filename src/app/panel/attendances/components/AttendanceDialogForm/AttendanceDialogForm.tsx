'use client';

import {
  CreateDisciplineRequestData,
  Discipline,
} from '@athena-types/discipline';
import { ErrorMessages } from '@athena-types/messages';
import { disciplineService } from '@services/discipline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
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

interface AttendanceDialogFormProps {
  open: boolean;
  disciplineToEdit?: Discipline;
  onClose: () => void;
}

export const AttendanceDialogForm: React.FC<AttendanceDialogFormProps> = ({
  open,
  disciplineToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<Discipline>();

  const { resetFields, setFieldsValue, validateFields } = form;

  const createDiscipline = useMutation({
    mutationFn: (data: CreateDisciplineRequestData) =>
      disciplineService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'disciplines' &&
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
          queryKey[0] === 'disciplines' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editDiscipline = useMutation({
    mutationFn: (data: Discipline) => disciplineService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'disciplines' && queryKey[3] === '',
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
          queryKey[0] === 'disciplines' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    if (createDiscipline.isLoading || editDiscipline.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        if (disciplineToEdit) {
          editDiscipline
            .mutateAsync({
              ...disciplineToEdit,
              ...data,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createDiscipline
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
    if (disciplineToEdit) {
      setFieldsValue({
        name: disciplineToEdit.name,
        workload: disciplineToEdit.workload,
        weeklyClasses: disciplineToEdit.weeklyClasses,
        syllabus: disciplineToEdit.syllabus,
      });
    }
  }, [disciplineToEdit]); // eslint-disable-line

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${disciplineToEdit ? 'Editar' : 'Novo'} registro`}
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
          loading={createDiscipline.isLoading || editDiscipline.isLoading}
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
        disabled={createDiscipline.isLoading || editDiscipline.isLoading}
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
          <Input size="large" placeholder="Dê um nome para a disciplina" />
        </Form.Item>

        <Form.Item
          required
          label="Carga horária"
          name="workload"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber
            size="large"
            min={1}
            max={999}
            addonAfter="Horas"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          required
          label="Aulas por semana"
          name="weeklyClasses"
          rules={[{ required: true, message: '' }]}
        >
          <InputNumber
            size="large"
            min={1}
            max={35}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          required
          label="Ementa"
          name="syllabus"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
          ]}
        >
          <TextArea
            showCount
            size="large"
            maxLength={500}
            placeholder="Descreva aqui a ementa..."
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
