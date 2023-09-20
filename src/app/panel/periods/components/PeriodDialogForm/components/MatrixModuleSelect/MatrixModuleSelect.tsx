import { PeriodForm } from '@athena-types/period';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { matrixService } from '@services/matrix';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Select } from 'antd';
import { useState } from 'react';

interface MatrixModuleSelectProps {
  form: FormInstance<PeriodForm>;
}

export const MatrixModuleSelect: React.FC<MatrixModuleSelectProps> = ({
  form,
}) => {
  const { setFieldValue } = form;

  const selectedMatrixGuid = Form.useWatch('matrixGuid', form);

  const [search, setSearch] = useState('');

  const [matrixModule, setMatrixModule] = useState<{
    guid: string;
    name: string;
  }>();

  const { data, isLoading } = useQuery(['matrix', selectedMatrixGuid], {
    queryFn: () => matrixService.getByGuid(selectedMatrixGuid),
    staleTime: Infinity,
    enabled: selectedMatrixGuid !== undefined,
  });

  return (
    <Form.Item
      required
      label="Módulo"
      name="matrixModuleGuid"
      rules={[{ required: true, message: '' }]}
    >
      <Select
        showSearch
        size="large"
        placeholder="Selecione o módulo a ser ofertado"
        optionFilterProp="children"
        loading={isLoading}
        value={matrixModule?.name}
        onChange={(value) => {
          const foundMatrixModule = data?.modules.find((m) => m.name === value);

          if (foundMatrixModule) {
            setMatrixModule({
              guid: foundMatrixModule.guid as string,
              name: foundMatrixModule.name,
            });
            setFieldValue('matrixModuleGuid', foundMatrixModule?.guid);
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
