import { MinusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Matrix, MatrixModuleDiscipline } from '@athena-types/matrix';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { disciplineService } from '@services/discipline';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Form,
  FormInstance,
  FormListFieldData,
  Select,
  Space,
  Tooltip,
} from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled(Space)`
  width: 100%;

  .ant-space-item:first-of-type {
    width: 100%;
  }
`;

interface ModuleDisciplineSelectProps {
  showRemove: boolean;
  form: FormInstance<Matrix>;
  moduleField: FormListFieldData;
  field: FormListFieldData;
  onRemove: () => void;
}

export const ModuleDisciplineSelect: React.FC<ModuleDisciplineSelectProps> = ({
  showRemove,
  form,
  moduleField,
  field,
  onRemove,
}) => {
  const modules = Form.useWatch('modules', form);

  const { getFieldValue, setFieldValue } = form;

  const [discipline, setDiscipline] = useState<MatrixModuleDiscipline>();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(['disciplines', 1, 'active', search], {
    queryFn: () =>
      disciplineService.getPaginated({
        filterByStatus: GenericStatus.active,
        query: search,
      }),
    staleTime: Infinity,
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value === '' || value.length >= 3) {
        setSearch(value);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const value = getFieldValue([
      'modules',
      moduleField.name,
      'disciplines',
      field.name,
    ]);
    if (value) {
      setDiscipline(value);
    }
  }, []);

  return (
    <Container>
      <Select
        showSearch
        style={{ width: '100%' }}
        size="large"
        placeholder="Adicione uma disciplina"
        optionFilterProp="children"
        loading={isLoading}
        value={discipline?.name}
        onChange={(value) => {
          const foundDiscipline = data?.data?.find((d) => d.name === value);

          setDiscipline({
            guid: foundDiscipline?.guid ?? '',
            workload: foundDiscipline?.workload ?? 0,
            weeklyClasses: foundDiscipline?.weeklyClasses ?? 0,
            name: value,
          });
          setFieldValue(
            ['modules', moduleField.name, 'disciplines', field.name],
            {
              guid: foundDiscipline?.guid ?? '',
              workload: foundDiscipline?.workload ?? 0,
              name: value,
            }
          );
        }}
        options={data?.data
          ?.filter((discipline) => {
            const selectedDisciplines = modules
              ?.map((module) => module.disciplines)
              .flat();

            return !selectedDisciplines?.find(
              (d) => d?.name === discipline.name
            );
          })
          .map((discipline) => ({
            label: discipline.name,
            value: discipline.name,
          }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />

      {discipline?.workload && (
        <span style={{ whiteSpace: 'nowrap' }}>{discipline.workload} hrs</span>
      )}

      {showRemove && (
        <Tooltip placement="bottom" title="Remover disciplina">
          <Button size="middle" shape="circle" type="text" onClick={onRemove}>
            <MinusCircleOutlined />
          </Button>
        </Tooltip>
      )}
    </Container>
  );
};
