'use client';

import { AttendanceLog, AttendanceLogForm } from '@athena-types/attendanceLog';
import { ErrorMessages } from '@athena-types/messages';
import { attendanceLogService } from '@services/attendanceLog';
import { periodService } from '@services/period';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Modal,
  Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { StudentsList } from './StudentsList';

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

const StyledSpace = styled(Space)`
  width: 100%;

  & .ant-space-item {
    width: 100%;

    & > div {
      width: 100%;
    }
  }
`;

interface AttendanceDialogFormProps {
  open: boolean;
  selectedPeriod: string;
  selectedDiscipline: string;
  attendanceToEditGuid?: string;
  onClose: () => void;
}

export const AttendanceDialogForm: React.FC<AttendanceDialogFormProps> = ({
  open,
  selectedPeriod,
  selectedDiscipline,
  attendanceToEditGuid,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { addProgressIndicatorItem, removeProgressIndicatorItem } =
    useProgressIndicator();

  const [form] = Form.useForm<AttendanceLogForm>();

  const { resetFields, setFieldsValue, setFieldValue, validateFields } = form;

  const { data: attendanceToEdit, isFetching } = useQuery({
    queryKey: ['attendanceLog', attendanceToEditGuid],
    queryFn: () => attendanceLogService.getByGuid(attendanceToEditGuid ?? ''),
    onSuccess: (data) => {
      setFieldsValue({ ...data, classDate: dayjs(data.classDate) });
    },
    staleTime: Infinity,
    enabled: !!attendanceToEditGuid,
  });

  const { data: enrollments, isFetching: isFetchingEnrollments } = useQuery({
    queryKey: ['periodEnrollments', selectedPeriod],
    queryFn: () => periodService.getEnrollments(selectedPeriod ?? ''),
    onSuccess: (data) => {
      setFieldValue(
        'studentAbsences',
        data.map(({ studentGuid, studentName }) => ({
          studentGuid,
          studentName,
          totalAbsences: 0,
        }))
      );
    },
    staleTime: Infinity,
    enabled: !attendanceToEditGuid && !!selectedPeriod,
  });

  const createAttendanceLog = useMutation({
    mutationFn: (data: AttendanceLog) => attendanceLogService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries([
        'attendanceLogs',
        newItem.periodGuid,
        newItem.disciplineGuid,
      ]);
    },
  });

  const editAttendanceLog = useMutation({
    mutationFn: (data: AttendanceLog) => attendanceLogService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        ['attendanceLog', updatedData.guid],
        updatedData
      );

      queryClient.invalidateQueries([
        'attendanceLogs',
        selectedPeriod,
        selectedDiscipline,
      ]);
    },
  });

  const handleCancel = () => {
    if (createAttendanceLog.isLoading || editAttendanceLog.isLoading) {
      return;
    }

    resetFields();
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        const dataToUse = {
          ...data,
          classDate: dayjs(data.classDate).toISOString(),
        };

        if (attendanceToEdit) {
          editAttendanceLog
            .mutateAsync({
              ...attendanceToEdit,
              ...dataToUse,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createAttendanceLog
            .mutateAsync({
              ...dataToUse,
              periodGuid: selectedPeriod,
              disciplineGuid: selectedDiscipline,
            })
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
    if (isFetchingEnrollments) {
      addProgressIndicatorItem({
        id: 'fetch-enrollments',
        message: 'Obtendo matrículas...',
      });

      return;
    }

    if (enrollments && !attendanceToEditGuid) {
      setFieldValue(
        'studentAbsences',
        enrollments.map(({ studentGuid, studentName }) => ({
          studentGuid,
          studentName,
          totalAbsences: 0,
        }))
      );
    }

    removeProgressIndicatorItem('fetch-enrollments');
  }, [isFetchingEnrollments, attendanceToEditGuid]);

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${attendanceToEdit ? 'Editar' : 'Novo'} registro`}
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
          loading={createAttendanceLog.isLoading || editAttendanceLog.isLoading}
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
        disabled={createAttendanceLog.isLoading || editAttendanceLog.isLoading}
        form={form}
        initialValues={{
          totalClasses: 1,
          classDate: dayjs(),
        }}
      >
        <StyledSpace>
          <Form.Item
            required
            label="Quantidade de aulas"
            name="totalClasses"
            rules={[{ required: true, message: '' }]}
          >
            <InputNumber
              size="large"
              min={1}
              max={999}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item required label="Data de registro" name="classDate">
            <DatePicker
              size="large"
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </StyledSpace>

        <Form.Item
          required
          label="Conteúdo ministrado"
          name="classSummary"
          rules={[
            { required: true, message: '' },
            { type: 'string', min: 3, message: ErrorMessages.MSGE08 },
          ]}
        >
          <TextArea
            showCount
            size="large"
            maxLength={1024}
            placeholder="Descreva aqui o conteúdo ministrado na aula..."
            autoSize={{ minRows: 2, maxRows: 10 }}
          />
        </Form.Item>

        <Divider orientation="left" style={{ margin: 0 }}>
          Alunos
        </Divider>

        <StudentsList form={form} />
      </Form>
    </StyledModal>
  );
};
