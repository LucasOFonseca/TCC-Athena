'use client';

import { EnvironmentFilled, UserOutlined } from '@ant-design/icons';
import { ErrorMessages } from '@athena-types/messages';
import { CreateStudentRequestData, Student } from '@athena-types/student';
import { studentService } from '@services/student';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, Steps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { AddressFormStep } from '../../../components/AddressFormStep';
import { PersonalInfoFormStep } from '../../../components/PersonalInfoFormStep';

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

interface StudentDialogFormProps {
  open: boolean;
  studentToEdit?: Student;
  onClose: () => void;
}

export const StudentDialogForm: React.FC<StudentDialogFormProps> = ({
  open,
  studentToEdit,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);

  const [form] = Form.useForm<Student>();

  const { resetFields, setFieldsValue, validateFields, getFieldsValue } = form;

  const createStudent = useMutation({
    mutationFn: (data: CreateStudentRequestData) => studentService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'students' &&
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
          queryKey[0] === 'students' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editStudent = useMutation({
    mutationFn: (data: Student) => studentService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'students' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Student) => item.guid === updatedData.guid
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
          queryKey[0] === 'students' && queryKey[3] !== '',
      });
    },
  });

  const handleCancel = () => {
    resetFields();
    setIsFirstStepValid(false);
    setStep(0);
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then(() => {
        const dataToSend = getFieldsValue([
          'guid',
          'name',
          'cpf',
          'birthdate',
          'email',
          'phoneNumber',
          'address',
        ]);

        dataToSend.cpf = dataToSend.cpf.replace(/\D/g, '');
        dataToSend.phoneNumber = dataToSend.phoneNumber.replace(/\D/g, '');
        dataToSend.address.cep = dataToSend.address.cep.replace(/\D/g, '');

        if (studentToEdit) {
          editStudent
            .mutateAsync({
              ...studentToEdit,
              ...dataToSend,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createStudent
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
    if (studentToEdit) {
      setIsFirstStepValid(true);

      setFieldsValue({
        guid: studentToEdit.guid,
        name: studentToEdit.name,
        cpf: studentToEdit.cpf,
        birthdate: dayjs(studentToEdit.birthdate) as any,
        email: studentToEdit.email,
        phoneNumber: studentToEdit.phoneNumber,
        address: studentToEdit.address,
      });
    }
  }, [studentToEdit]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${studentToEdit ? 'Editar' : 'Adicionar'} aluno`}
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
          loading={createStudent.isLoading || editStudent.isLoading}
          type="primary"
          disabled={!isFirstStepValid && step === 0}
          style={{ width: 'calc(50% - 4px)' }}
          onClick={() => {
            if (step < 1) {
              setStep(step + 1);

              return;
            }

            handleSubmit();
          }}
        >
          {step < 1 ? 'Próximo' : 'Salvar'}
        </Button>,
      ]}
    >
      <Steps
        size="small"
        current={step}
        onChange={(vale) => setStep(vale)}
        style={{ margin: '24px 0 16px' }}
        items={[
          {
            title: 'Dados pessoais',
            disabled: createStudent.isLoading || editStudent.isLoading,
            icon: <UserOutlined />,
          },
          {
            title: 'Endereço',
            disabled:
              !isFirstStepValid ||
              createStudent.isLoading ||
              editStudent.isLoading,
            icon: <EnvironmentFilled />,
          },
        ]}
      />

      {step === 0 && (
        <PersonalInfoFormStep
          form={form}
          onStepValidate={(isValid) => setIsFirstStepValid(isValid)}
        />
      )}

      {step === 1 && (
        <AddressFormStep externalForm={form} onStepValidate={() => {}} />
      )}
    </StyledModal>
  );
};
