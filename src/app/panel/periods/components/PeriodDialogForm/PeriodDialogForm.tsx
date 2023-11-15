'use client';

import { ErrorMessages } from '@athena-types/messages';
import {
  CreatePeriodRequestData,
  Period,
  PeriodForm,
  PeriodStatus,
} from '@athena-types/period';
import { periodService } from '@services/period';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { ClassroomSelect } from './components/ClassroomSelect';
import { DisciplinesScheduleList } from './components/DisciplinesScheduleList';
import { MatrixModuleSelect } from './components/MatrixModuleSelect';
import { MatrixSelect } from './components/MatrixSelect';
import { ShiftSelect } from './components/ShiftSelect';

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

const StyledSpace = styled(Space)`
  width: 100%;

  & .ant-space-item {
    & > div {
      width: 100%;
    }
  }

  & .ant-space-item:first-of-type {
    width: 100%;
  }

  & .ant-space-item:last-of-type {
    width: 150px;
  }
`;

const classIds = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

interface PeriodDialogFormProps {
  open: boolean;
  editScheduleOnly: boolean;
  periodToEditGuid?: string;
  onClose: () => void;
}

export const PeriodDialogForm: React.FC<PeriodDialogFormProps> = ({
  open,
  editScheduleOnly,
  periodToEditGuid,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { addProgressIndicatorItem, removeProgressIndicatorItem } =
    useProgressIndicator();

  const [form] = Form.useForm<PeriodForm>();

  const selectedMatrix = Form.useWatch('matrixGuid', form);
  const selectedMatrixModule = Form.useWatch('matrixModuleGuid', form);
  const schedules = Form.useWatch('disciplinesSchedule', form);

  const { resetFields, setFieldValue, setFieldsValue, validateFields } = form;

  const { data: periodToEdit, isFetching } = useQuery({
    queryKey: ['period', periodToEditGuid],
    queryFn: () => periodService.getByGuid(periodToEditGuid ?? ''),
    onSuccess: (data) => {
      setFieldsValue({
        ...data,
        deadline: dayjs(data.deadline),
        enrollmentEndDate: dayjs(data.enrollmentEndDate),
        enrollmentStartDate: dayjs(data.enrollmentStartDate),
      });
    },
    staleTime: Infinity,
    enabled: !!periodToEditGuid,
  });

  const createPeriod = useMutation({
    mutationFn: (data: CreatePeriodRequestData) => periodService.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'periods' &&
            (queryKey[1] as number) === 1 &&
            (queryKey[2] === 'all' ||
              queryKey[2] === 'draft' ||
              queryKey[2] === 'notStarted') &&
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
          queryKey[0] === 'periods' &&
          ((queryKey[1] as number) > 1 ||
            queryKey[2] === 'inactive' ||
            queryKey[3] !== ''),
      });
    },
  });

  const editPeriod = useMutation({
    mutationFn: (data: Period) => periodService.update(data),
    onSuccess: (updatedData) => {
      queryClient.setQueriesData(
        {
          predicate: ({ queryKey }) =>
            queryKey[0] === 'periods' && queryKey[3] === '',
        },
        (data: any) => {
          const itemIndex: number = data.data.findIndex(
            (item: Period) => item.guid === updatedData.guid
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
          (queryKey[0] === 'periods' && queryKey[3] !== '') ||
          (queryKey[0] === 'period' && queryKey[1] === updatedData.guid),
      });
    },
  });

  const handleCancel = () => {
    resetFields();
    setFieldValue('vacancies', 40);
    onClose();
  };

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        const isDraft = Object.values(data).some((item) => item === undefined);

        const parsedData: CreatePeriodRequestData | Period = {
          ...data,
          deadline: data.deadline?.format(),
          enrollmentStartDate: data.enrollmentStartDate?.format(),
          enrollmentEndDate: data.enrollmentEndDate?.format(),
        };

        if (isDraft) {
          parsedData.status = PeriodStatus.draft;
        } else if (periodToEdit?.status === PeriodStatus.draft) {
          parsedData.status = PeriodStatus.notStarted;
        }

        if (periodToEdit) {
          editPeriod
            .mutateAsync({
              ...periodToEdit,
              ...parsedData,
            })
            .then(() => {
              handleCancel();
            })
            .catch(() => {});
        } else {
          createPeriod
            .mutateAsync(parsedData)
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
    if (open && !periodToEdit) {
      setFieldValue('vacancies', 40);
    }
  }, [open]);

  useEffect(() => {
    if (isFetching) {
      addProgressIndicatorItem({
        id: 'fetch-period',
        message: 'Obtendo dados do período...',
      });

      return;
    }

    if (periodToEdit && periodToEdit.guid === periodToEditGuid) {
      setFieldsValue({
        ...periodToEdit,
        deadline: dayjs(periodToEdit.deadline),
        enrollmentEndDate: dayjs(periodToEdit.enrollmentEndDate),
        enrollmentStartDate: dayjs(periodToEdit.enrollmentStartDate),
      });
    }

    removeProgressIndicatorItem('fetch-period');
  }, [isFetching, periodToEdit, periodToEditGuid]);

  return (
    <StyledModal
      centered
      destroyOnClose
      open={open}
      onCancel={handleCancel}
      title={editScheduleOnly ? 'Editar cronograma' : 'Ofertar curso/módulo'}
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
          loading={createPeriod.isLoading || editPeriod.isLoading}
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
        disabled={createPeriod.isLoading || editPeriod.isLoading}
        form={form}
        initialValues={{
          classId: 'A',
          disciplinesSchedule: [],
        }}
      >
        {!editScheduleOnly && (
          <>
            <Form.Item label="Período de matrícula">
              <Space.Compact block>
                <Form.Item
                  style={{ margin: 0, display: 'inline-block', width: '50%' }}
                  name="enrollmentStartDate"
                  rules={[
                    () => ({
                      validator(_, value) {
                        const isInvalid = dayjs(value).isBefore(new Date());

                        if (isInvalid) {
                          return Promise.reject(ErrorMessages.MSGE10);
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder="Início"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  name="enrollmentEndDate"
                  style={{ margin: 0, display: 'inline-block', width: '50%' }}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        const isInvalid = dayjs(value).isBefore(new Date());

                        if (isInvalid) {
                          return Promise.reject(ErrorMessages.MSGE10);
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder="Término"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              label="Data final do período"
              name="deadline"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();

                    const isInvalid = dayjs(value).isBefore(new Date());

                    if (isInvalid) {
                      return Promise.reject(ErrorMessages.MSGE10);
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                size="large"
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="Vagas" name="vacancies">
              <Input size="large" type="number" defaultValue={40} />
            </Form.Item>

            <StyledSpace>
              <ClassroomSelect form={form} />

              <Form.Item label="Turma" name="classId">
                <Select
                  size="large"
                  optionFilterProp="children"
                  options={classIds.map((id) => ({
                    label: id,
                    value: id,
                  }))}
                />
              </Form.Item>
            </StyledSpace>
          </>
        )}

        <div style={{ display: editScheduleOnly ? 'none' : 'contents' }}>
          <ShiftSelect form={form} />

          <MatrixSelect form={form} />

          {selectedMatrix && <MatrixModuleSelect form={form} />}
        </div>

        {selectedMatrixModule && (
          <DisciplinesScheduleList
            periodGuid={periodToEdit?.guid}
            form={form}
          />
        )}
      </Form>
    </StyledModal>
  );
};
