import { GenericStatus } from '@athena-types/genericStatus';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { courseService } from '@services/course';
import { useQuery } from '@tanstack/react-query';
import { Form, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

export const CourseSelect: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(['courses', 1, 'active', search], {
    queryFn: () =>
      courseService.getPaginated({
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
      label="Curso"
      name="courseGuid"
      rules={[{ required: true, message: '' }]}
    >
      <Select
        showSearch
        size="large"
        placeholder="Selecione o curso para a matriz"
        optionFilterProp="children"
        loading={isLoading}
        options={data?.data?.map((course) => ({
          label: course.name,
          value: course.guid,
        }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />
    </Form.Item>
  );
};
