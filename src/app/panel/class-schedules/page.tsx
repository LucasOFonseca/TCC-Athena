'use client';

import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ClassSchedule } from '@athena-types/classSchedule';
import { GenericStatus } from '@athena-types/genericStatus';
import { Shift, ShiftType } from '@athena-types/shift';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { translateShift } from '@helpers/utils/translateShift';
import { shiftService } from '@services/shift';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Empty, FloatButton, Modal, Radio, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { ClassSchedulesDialogForm } from './components/ClassSchedulesDialogForm';
import { ClassSchedulesMatrix } from './components/ClassSchedulesMatrix';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    min-width: max-content;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export default function ClassSchedulesPage() {
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const { data: shifts } = useQuery(['shifts'], {
    queryFn: () => shiftService.getAll(),
    staleTime: Infinity,
  });

  const [currentShift, setCurrentShift] = useState<Shift>();

  const changeShiftStatus = useMutation({
    mutationFn: () =>
      shiftService.changeStatus(
        currentShift?.guid ?? '',
        currentShift?.status === GenericStatus.active
          ? GenericStatus.inactive
          : GenericStatus.active
      ),
    onSuccess: (updatedShift) => {
      queryClient.setQueryData(['shifts'], (old: any) => {
        const newData: Shift[] = old;

        const index = newData.findIndex(
          (shift) => shift.guid === updatedShift.guid
        );

        newData[index] = updatedShift;

        return newData;
      });

      setCurrentShift(updatedShift);
    },
  });

  const { data: classSchedules } = useQuery(
    ['shifts', currentShift?.guid, 'classSchedules'],
    {
      queryFn: () => shiftService.getClassSchedules(currentShift?.guid ?? ''),
      enabled: !!currentShift?.guid,
      staleTime: Infinity,
    }
  );

  const [schedulesToEdit, setSchedulesToEdit] = useState<ClassSchedule[]>();
  const [showClassSchedulesDialogForm, setShowClassSchedulesDialogForm] =
    useState(false);

  const handleOpenClassSchedulesDialogForm = (schedules?: ClassSchedule[]) => {
    if (schedules) {
      setSchedulesToEdit(schedules);
    }

    setShowClassSchedulesDialogForm(true);
  };

  const handleCloseClassSchedulesDialogForm = () => {
    setShowClassSchedulesDialogForm(false);

    if (schedulesToEdit) {
      setSchedulesToEdit(undefined);
    }
  };

  const handleChangeShiftStatus = () => {
    confirm({
      centered: true,
      title: `Alterar status para ${
        status === GenericStatus.active ? '"inativo"' : '"ativo"'
      }?`,
      icon: <ExclamationCircleOutlined />,
      content: `Após confirmar o cadastro ficará ${
        currentShift?.status === GenericStatus.active
          ? 'indisponível para uso até que o status retorne para "ativo".'
          : 'disponível para uso.'
      }`,
      okText: 'Alterar',
      cancelButtonProps: {
        danger: true,
      },
      onOk() {
        changeShiftStatus.mutate();
      },
    });
  };

  useEffect(() => {
    if (shifts && !currentShift) {
      setCurrentShift(shifts[0]);
    }
  }, [shifts]); // eslint-disable-line

  return (
    <>
      {currentShift && (
        <ClassSchedulesDialogForm
          open={showClassSchedulesDialogForm}
          shift={currentShift}
          schedulesToEdit={schedulesToEdit}
          onClose={handleCloseClassSchedulesDialogForm}
        />
      )}

      <ClientComponentLoader loader={<Skeleton height={33} />}>
        <PageHeader>
          <Space size="middle">
            <h4>
              Horários -{' '}
              {translateShift(currentShift?.shift ?? ShiftType.morning)}
            </h4>

            <Switch
              loading={changeShiftStatus.isLoading}
              checkedChildren="ATIVO"
              unCheckedChildren="INATIVO"
              onClick={handleChangeShiftStatus}
              checked={currentShift?.status === GenericStatus.active}
            />
          </Space>

          <Radio.Group
            size="middle"
            value={currentShift?.guid}
            onChange={(e) =>
              setCurrentShift(shifts?.find((s) => s.guid === e.target.value))
            }
          >
            {shifts?.map(({ guid, shift }) => (
              <Radio.Button key={guid} value={guid}>
                {translateShift(shift)}
              </Radio.Button>
            ))}
          </Radio.Group>
        </PageHeader>

        {currentShift?.status === GenericStatus.inactive && (
          <Alert
            style={{ marginTop: 16 }}
            message="Este turno está desativado!"
            type="warning"
            showIcon
          />
        )}
      </ClientComponentLoader>

      <ClientComponentLoader>
        <div style={{ marginTop: 32 }}>
          {classSchedules && classSchedules.length > 0 ? (
            <ClassSchedulesMatrix
              classSchedules={classSchedules}
              onEdit={handleOpenClassSchedulesDialogForm}
            />
          ) : (
            <Empty />
          )}
        </div>

        <FloatButton
          icon={<PlusOutlined />}
          tooltip="Adicionar horários"
          type="primary"
          style={{ right: 16, bottom: 16 }}
          onClick={() => handleOpenClassSchedulesDialogForm()}
        />
      </ClientComponentLoader>
    </>
  );
}
