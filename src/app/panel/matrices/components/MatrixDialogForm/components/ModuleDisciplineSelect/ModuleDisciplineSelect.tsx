import { MinusCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Matrix, MatrixModuleDiscipline } from '@athena-types/matrix';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { disciplineService } from '@services/discipline';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
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
  index: number;
  form: FormInstance<Matrix>;
  moduleField: FormListFieldData;
  field: FormListFieldData;
  onRemove: () => void;
}

export const ModuleDisciplineSelect: React.FC<ModuleDisciplineSelectProps> = ({
  showRemove,
  index,
  form,
  moduleField,
  field,
  onRemove,
}) => {
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

  const handleRemove = () => {
    setFieldValue(
      ['modules', moduleField.name, 'disciplines'],
      getFieldValue(['modules', moduleField.name, 'disciplines']).splice(
        index,
        1
      )
    );

    onRemove();
  };

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
        value={discipline?.guid}
        onChange={(value) => {
          const foundDiscipline = data?.data?.find((d) => d.guid === value);

          setDiscipline({
            guid: value,
            workload: foundDiscipline?.workload ?? 0,
            name: foundDiscipline?.name ?? '',
          });
          setFieldValue(
            ['modules', moduleField.name, 'disciplines', field.name],
            {
              guid: value,
              workload: foundDiscipline?.workload ?? 0,
              name: foundDiscipline?.name ?? '',
            }
          );
        }}
        options={data?.data?.map((discipline) => ({
          label: discipline.name,
          value: discipline.guid,
        }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />

      {discipline && (
        <span style={{ whiteSpace: 'nowrap' }}>{discipline.workload} hrs</span>
      )}

      {showRemove && (
        <Tooltip placement="bottom" title="Remover disciplina">
          <Button
            size="middle"
            shape="circle"
            type="text"
            onClick={handleRemove}
          >
            <MinusCircleOutlined />
          </Button>
        </Tooltip>
      )}
    </Container>
  );
};
