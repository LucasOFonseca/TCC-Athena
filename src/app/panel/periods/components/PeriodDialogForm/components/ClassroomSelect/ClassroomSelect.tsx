'use client';

import { Classroom } from '@athena-types/classroom';
import { GenericStatus } from '@athena-types/genericStatus';
import { PeriodForm } from '@athena-types/period';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { classroomService } from '@services/classroom';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

interface ClassroomSelectProps {
  form: FormInstance<PeriodForm>;
}

export const ClassroomSelect: React.FC<ClassroomSelectProps> = ({ form }) => {
  const vacancies = Form.useWatch('vacancies', form);

  const { getFieldValue, setFieldValue } = form;

  const [classroom, setClassroom] = useState<Classroom>();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(['classrooms', 1, 'active', search], {
    queryFn: () =>
      classroomService.getPaginated({
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
    const value = getFieldValue('classroomGuid');
    if (value) {
      const classroom = data?.data?.find(
        (classroom) => classroom.guid === value
      );

      if (classroom) {
        setClassroom(classroom);

        return;
      }

      classroomService.getByGuid(value).then((classroom) => {
        setClassroom(classroom);
      });
    }
  }, []);

  return (
    <Form.Item label="Sala" name="classroomGuid">
      <Select
        showSearch
        size="large"
        placeholder="Sala 01"
        optionFilterProp="children"
        loading={isLoading}
        value={classroom?.name}
        onChange={(value) => {
          const foundClassroom = data?.data?.find((c) => c.guid === value);

          setClassroom(foundClassroom);
          setFieldValue('classroomGuid', foundClassroom?.guid);
        }}
        options={data?.data
          ?.filter((classroom) => classroom.capacity >= (vacancies ?? 0))
          .map((classroom) => ({
            label: `${classroom.name} (Cap. ${classroom.capacity})`,
            value: classroom.guid,
          }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />
    </Form.Item>
  );
};
