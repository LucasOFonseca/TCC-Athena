import { ClassSchedule } from '@athena-types/classSchedule';
import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { matrixService } from '@services/matrix';
import { shiftService } from '@services/shift';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Form, FormInstance, Modal } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DisciplineSchedulesMatrix } from './components/DisciplineSchedulesMatrix';
import { EmployeeSelect } from './components/EmployeeSelect';

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

interface DisciplineScheduleDialogFormProps {
  open: boolean;
  index: number;
  disciplineSchedule?: DisciplineSchedule;
  form: FormInstance<PeriodForm>;
  onClose: () => void;
}

export const DisciplineScheduleDialogForm: React.FC<
  DisciplineScheduleDialogFormProps
> = ({ open, index, disciplineSchedule, form, onClose }) => {
  const { setFieldValue } = form;

  const shiftGuid = Form.useWatch('shiftGuid', form);
  const selectedMatrixGuid = Form.useWatch('matrixGuid', form);
  const selectedMatrixModuleGuid = Form.useWatch('matrixModuleGuid', form);

  const { data: classSchedules } = useQuery(
    ['shifts', shiftGuid, 'classSchedules'],
    {
      queryFn: () => shiftService.getClassSchedules(shiftGuid ?? ''),
      enabled: !!shiftGuid,
      staleTime: Infinity,
    }
  );
  const { data: selectedMatrix } = useQuery(['matrix', selectedMatrixGuid], {
    queryFn: () => matrixService.getByGuid(selectedMatrixGuid),
    staleTime: Infinity,
    enabled: selectedMatrixGuid !== undefined,
  });

  const [disciplineInfo, setDisciplineInfo] = useState<{
    name: string;
    weeklyClasses: number;
  }>();
  const [employee, setEmployee] = useState<{ guid: string; name: string }>();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);

  const handleAddSchedule = (schedule: ClassSchedule) => {
    setSchedules((currentValues) => [...currentValues, schedule]);
  };

  const handleRemoveSchedule = (guid: string) => {
    setSchedules((currentValues) =>
      currentValues.filter((s) => s.guid !== guid)
    );
  };

  const handleCancel = () => {
    setEmployee(
      disciplineSchedule?.employeeGuid && disciplineSchedule?.employeeName
        ? {
            guid: disciplineSchedule?.employeeGuid,
            name: disciplineSchedule?.employeeName,
          }
        : undefined
    );
    setSchedules(disciplineSchedule?.schedules ?? []);

    onClose();
  };

  const handleSave = () => {
    setFieldValue(['disciplinesSchedule', index], {
      ...disciplineSchedule,
      schedules,
      employeeGuid: employee?.guid,
      employeeName: employee?.name,
    });

    handleCancel();
  };

  useEffect(() => {
    if (!disciplineSchedule) return;

    const matrixModule = selectedMatrix?.modules.find(
      (m) => m.guid === selectedMatrixModuleGuid
    );
    const discipline = matrixModule?.disciplines.find(
      (d) => d.guid === disciplineSchedule.disciplineGuid
    );

    if (discipline) {
      setDisciplineInfo({
        name: discipline.name,
        weeklyClasses: discipline.weeklyClasses,
      });

      setEmployee({
        guid: disciplineSchedule.employeeGuid,
        name: disciplineSchedule.employeeName,
      });
      setSchedules(disciplineSchedule.schedules);
    }
  }, [selectedMatrix, selectedMatrixModuleGuid, disciplineSchedule]);

  return (
    <StyledModal
      centered
      destroyOnClose
      open={open}
      onCancel={handleCancel}
      title="Cronograma da disciplina"
      width={1150}
      footer={[
        <Button danger key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button
          disabled={
            !employee || schedules.length < (disciplineInfo?.weeklyClasses ?? 0)
          }
          key="submit"
          type="primary"
          onClick={handleSave}
        >
          Salvar
        </Button>,
      ]}
    >
      <EmployeeSelect employee={employee} onChange={setEmployee} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '1rem',
          marginBottom: 8,
        }}
      >
        <p>
          <strong>Disciplina:</strong> {disciplineInfo?.name}
        </p>

        <p>
          <strong>Aulas restantes:</strong>{' '}
          {(disciplineInfo?.weeklyClasses ?? 0) - schedules.length}
        </p>
      </div>

      {classSchedules && classSchedules.length > 0 ? (
        <DisciplineSchedulesMatrix
          form={form}
          disableSelection={disciplineInfo?.weeklyClasses === schedules.length}
          classSchedules={classSchedules}
          employeeGuid={employee?.guid ?? ''}
          disciplineName={disciplineInfo?.name ?? ''}
          selectedSchedules={schedules}
          onSelect={handleAddSchedule}
          onUnselect={handleRemoveSchedule}
        />
      ) : (
        <Alert
          message="O turno selecionado não possui horários!"
          type="warning"
          showIcon
        />
      )}
    </StyledModal>
  );
};
