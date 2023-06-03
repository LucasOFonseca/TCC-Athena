'use client';

import {
  ClassSchedule,
  CreateClassScheduleRequestData,
} from '@athena-types/classSchedule';
import { DayOfWeek } from '@athena-types/dayOfWeek';
import { GenericStatus } from '@athena-types/genericStatus';
import { ErrorMessages } from '@athena-types/messages';
import { Shift } from '@athena-types/shift';
import { StatusButton } from '@components/StatusButton';
import {
  allDaysOfWeek,
  translateDayOfWeek,
  translateShift,
} from '@helpers/utils';
import { classScheduleService } from '@services/classSchedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Checkbox,
  Form,
  Modal,
  Select,
  Space,
  TimePicker,
  theme,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const { Option } = Select;

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

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

interface ClassScheduleForm {
  classNumber: number;
  daysOfWeek: DayOfWeek[];
  startTime: Dayjs;
  endTime: Dayjs;
  status?: GenericStatus;
}

interface ClassSchedulesDialogFormProps {
  open: boolean;
  shift: Shift;
  schedulesToEdit?: ClassSchedule[];
  onClose: () => void;
}

export const ClassSchedulesDialogForm: React.FC<
  ClassSchedulesDialogFormProps
> = ({ open, shift, schedulesToEdit, onClose }) => {
  const { useToken } = theme;
  const { token } = useToken();
  const queryClient = useQueryClient();

  const [statusToShow, setStatusToShow] = useState<GenericStatus>();

  const [form] = Form.useForm<ClassScheduleForm>();

  const {
    resetFields,
    setFieldsValue,
    setFieldValue,
    getFieldValue,
    validateFields,
  } = form;

  const createSchedules = useMutation({
    mutationFn: (data: CreateClassScheduleRequestData[]) =>
      classScheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shifts', shift.guid, 'classSchedules']);
    },
  });

  const editSchedules = useMutation({
    mutationFn: (data: ClassSchedule[]) => classScheduleService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shifts', shift.guid, 'classSchedules']);
    },
  });

  const handleCancel = () => {
    if (createSchedules.isLoading || editSchedules.isLoading) {
      return;
    }

    resetFields();
    setStatusToShow(undefined);
    onClose();
  };

  const handleSubmit = () => {
    if (schedulesToEdit) {
      const schedulesToUpdate: ClassSchedule[] = [];

      schedulesToEdit.forEach(({ guid, status, classNumber, dayOfWeek }) => {
        schedulesToUpdate.push({
          guid,
          status: statusToShow || status,
          classNumber,
          dayOfWeek,
          startTime: getFieldValue('startTime').format(),
          endTime: getFieldValue('endTime').format(),
          shiftGuid: shift.guid,
        });
      });

      editSchedules
        .mutateAsync(schedulesToUpdate)
        .then(() => {
          handleCancel();
        })
        .catch(() => {});
    } else {
      validateFields()
        .then(({ classNumber, daysOfWeek, startTime, endTime }) => {
          const schedulesToCreate: CreateClassScheduleRequestData[] = [];

          daysOfWeek.forEach((dayOfWeek) => {
            schedulesToCreate.push({
              classNumber,
              dayOfWeek,
              startTime: startTime.format(),
              endTime: endTime.format(),
              shiftGuid: shift.guid,
            });
          });

          createSchedules
            .mutateAsync(schedulesToCreate)
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        })
        .catch(() => {
          Swal.fire('Ops!', ErrorMessages.MSGE01, 'error');
        });
    }
  };

  useEffect(() => {
    if (schedulesToEdit) {
      setFieldsValue({
        status: schedulesToEdit[0].status,
        classNumber: schedulesToEdit[0].classNumber,
        daysOfWeek: schedulesToEdit.map((schedule) => schedule.dayOfWeek),
        startTime: dayjs(schedulesToEdit[0].startTime),
        endTime: dayjs(schedulesToEdit[0].endTime),
      });

      setStatusToShow(schedulesToEdit[0].status);
    }
  }, [schedulesToEdit]); // eslint-disable-line

  return (
    <StyledModal
      centered
      open={open}
      onCancel={handleCancel}
      title={`${
        schedulesToEdit ? 'Editar' : 'Adicionar'
      } horário(s) - ${translateShift(shift.shift)}`}
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
          loading={createSchedules.isLoading || editSchedules.isLoading}
          type="primary"
          style={{ width: 'calc(50% - 4px)' }}
          onClick={handleSubmit}
        >
          Salvar
        </Button>,
      ]}
    >
      {schedulesToEdit && statusToShow ? (
        <InfoContainer>
          <p style={{ color: token.colorTextSecondary, fontWeight: 600 }}>
            {schedulesToEdit[0].classNumber}ª aula:{' '}
            <span style={{ textTransform: 'capitalize' }}>
              {schedulesToEdit
                .map(({ dayOfWeek }) => translateDayOfWeek(dayOfWeek, true))
                .join(', ')}
            </span>
          </p>

          <StatusButton
            currentStatus={statusToShow}
            onClick={() => {
              if (statusToShow === GenericStatus.active) {
                setStatusToShow(GenericStatus.inactive);
                setFieldValue('status', GenericStatus.inactive);
              } else {
                setStatusToShow(GenericStatus.active);
                setFieldValue('status', GenericStatus.active);
              }
            }}
          />
        </InfoContainer>
      ) : null}

      <Form
        layout="vertical"
        size="middle"
        disabled={createSchedules.isLoading || editSchedules.isLoading}
        form={form}
      >
        {!schedulesToEdit && (
          <>
            <Form.Item
              required
              label="Aula"
              name="classNumber"
              rules={[{ required: true, message: '' }]}
            >
              <Select placeholder="1ª aula">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Option key={index} value={index + 1}>
                    {index + 1}ª aula
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              required
              name="daysOfWeek"
              rules={[{ required: true, message: '' }]}
            >
              <Checkbox.Group>
                {allDaysOfWeek
                  .filter((day) => day !== DayOfWeek.sunday)
                  .map((day) => (
                    <Checkbox
                      key={day}
                      value={day}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {translateDayOfWeek(day, true)}
                    </Checkbox>
                  ))}
              </Checkbox.Group>
            </Form.Item>
          </>
        )}

        <Form.Item required label="Horário de início e fim da aula">
          <Space.Compact block>
            <Form.Item
              required
              style={{ display: 'inline-block', width: '50%' }}
              name="startTime"
              rules={[{ required: true, message: '' }]}
            >
              <TimePicker
                changeOnBlur
                format="HH:mm"
                style={{ width: '100%' }}
                placeholder="Início"
              />
            </Form.Item>

            <Form.Item
              required
              name="endTime"
              style={{ display: 'inline-block', width: '50%' }}
              rules={[{ required: true, message: '' }]}
            >
              <TimePicker
                changeOnBlur
                format="HH:mm"
                style={{ width: '100%' }}
                placeholder="Término"
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
