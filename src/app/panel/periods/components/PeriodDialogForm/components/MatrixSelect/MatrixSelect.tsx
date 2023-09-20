'use client';

import { GenericStatus } from '@athena-types/genericStatus';
import { PeriodForm } from '@athena-types/period';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { matrixService } from '@services/matrix';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

interface MatrixSelectProps {
  form: FormInstance<PeriodForm>;
}

export const MatrixSelect: React.FC<MatrixSelectProps> = ({ form }) => {
  const { setFieldValue } = form;

  const [search, setSearch] = useState('');

  const [matrix, setMatrix] = useState<{ guid: string; name: string }>();
  const { data, isLoading } = useQuery(['matrices', 1, 'active', search], {
    queryFn: () =>
      matrixService.getPaginated({
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

  return (
    <Form.Item
      required
      label="Matriz"
      name="matrixGuid"
      rules={[{ required: true, message: '' }]}
    >
      <Select
        showSearch
        size="large"
        placeholder="Selecione a matriz a ser ofertada"
        optionFilterProp="children"
        loading={isLoading}
        value={matrix?.name}
        onChange={(value) => {
          const foundMatrix = data?.data?.find((c) => c.name === value);

          if (foundMatrix) {
            setMatrix({ guid: foundMatrix.guid, name: foundMatrix.name });
            setFieldValue('matrixGuid', foundMatrix?.guid);
          }
        }}
        options={data?.data?.map((matrix) => ({
          label: matrix.name,
          value: matrix.guid,
        }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />
    </Form.Item>
  );
};
