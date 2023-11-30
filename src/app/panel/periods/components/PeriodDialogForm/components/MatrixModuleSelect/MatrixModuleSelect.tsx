import { DisciplineSchedule, PeriodForm } from '@athena-types/period';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { matrixService } from '@services/matrix';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';

interface MatrixModuleSelectProps {
  disabled: boolean;
  form: FormInstance<PeriodForm>;
}

export const MatrixModuleSelect: React.FC<MatrixModuleSelectProps> = ({
  disabled,
  form,
}) => {
  const { setFieldValue, getFieldValue } = form;

  const selectedMatrixGuid = Form.useWatch('matrixGuid', form);
  const selectedMatrixModuleGuid = Form.useWatch('matrixModuleGuid', form);

  const [matrixModule, setMatrixModule] = useState<{
    guid: string;
    name: string;
  }>();

  const { data, isLoading } = useQuery(['matrix', selectedMatrixGuid], {
    queryFn: () => matrixService.getByGuid(selectedMatrixGuid),
    staleTime: Infinity,
    enabled: selectedMatrixGuid !== undefined,
  });

  useEffect(() => {
    const foundMatrixModule = data?.modules.find(
      (m) => m.guid === selectedMatrixModuleGuid
    );

    if (foundMatrixModule) {
      const currentDisciplinesSchedule: DisciplineSchedule[] = getFieldValue(
        'disciplinesSchedule'
      );

      if (
        currentDisciplinesSchedule.length === 0 ||
        currentDisciplinesSchedule.some(
          (disciplineSchedule) =>
            !foundMatrixModule.disciplines.some(
              (discipline) =>
                discipline.guid === disciplineSchedule.disciplineGuid
            )
        )
      ) {
        setFieldValue(
          'disciplinesSchedule',
          foundMatrixModule.disciplines.map<DisciplineSchedule>(
            ({ guid, name }) => ({
              disciplineGuid: guid,
              disciplineName: name,
              employeeGuid: '',
              employeeName: '',
              schedules: [],
            })
          )
        );
      }
    }
  }, [data]);

  return (
    <Form.Item
      required
      label="Módulo"
      name="matrixModuleGuid"
      rules={[{ required: true, message: '' }]}
    >
      <Select
        showSearch
        disabled={disabled}
        size="large"
        placeholder="Selecione o módulo a ser ofertado"
        optionFilterProp="children"
        loading={isLoading}
        value={matrixModule?.name}
        onChange={(value) => {
          const foundMatrixModule = data?.modules.find((m) => m.guid === value);

          if (foundMatrixModule) {
            setMatrixModule({
              guid: foundMatrixModule.guid as string,
              name: foundMatrixModule.name,
            });
            setFieldValue('matrixModuleGuid', foundMatrixModule?.guid);

            if (
              !selectedMatrixGuid ||
              foundMatrixModule.guid !== selectedMatrixModuleGuid
            ) {
              const currentDisciplinesSchedule:
                | DisciplineSchedule[]
                | undefined = getFieldValue('disciplinesSchedule');

              if (
                !currentDisciplinesSchedule ||
                currentDisciplinesSchedule.length === 0 ||
                currentDisciplinesSchedule.some(
                  (disciplineSchedule) =>
                    !foundMatrixModule.disciplines.some(
                      (discipline) =>
                        discipline.guid === disciplineSchedule.disciplineGuid
                    )
                )
              ) {
                setFieldValue(
                  'disciplinesSchedule',
                  foundMatrixModule.disciplines.map<DisciplineSchedule>(
                    ({ guid, name }) => ({
                      disciplineGuid: guid,
                      disciplineName: name,
                      employeeGuid: '',
                      employeeName: '',
                      schedules: [],
                    })
                  )
                );
              }
            }
          }
        }}
        options={data?.modules.map((module) => ({
          label: module.name,
          value: module.guid,
        }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
      />
    </Form.Item>
  );
};
