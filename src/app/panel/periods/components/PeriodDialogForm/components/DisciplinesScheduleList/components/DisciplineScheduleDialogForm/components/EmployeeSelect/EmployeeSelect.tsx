import { EmployeeRole } from '@athena-types/employee';
import { GenericStatus } from '@athena-types/genericStatus';
import { includesIgnoreDiacritics } from '@helpers/utils';
import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Form, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled(Form.Item)`
  width: 250px;

  & > div {
    display: block;
  }
`;

interface EmployeeSelectProps {
  employee?: { guid: string; name: string };
  onChange: (value?: { guid: string; name: string }) => void;
}

export const EmployeeSelect: React.FC<EmployeeSelectProps> = ({
  employee,
  onChange,
}) => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery(
    ['employees', 1, 'active', search, 'educator'],
    {
      queryFn: () =>
        employeeService.getPaginated({
          filterByStatus: GenericStatus.active,
          query: search,
          role: EmployeeRole.educator,
        }),
      staleTime: Infinity,
    }
  );

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value === '' || value.length >= 3) {
        setSearch(value);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (employee && data) {
      const foundEmployee = data?.data?.find((c) => c.guid === employee.guid);

      if (foundEmployee) {
        onChange({
          guid: foundEmployee.guid as string,
          name: foundEmployee.name,
        });
      }
    }
  }, [employee, data]);

  return (
    <Container required label="Professor">
      <Select
        showSearch
        size="large"
        placeholder="Selecione o professor"
        optionFilterProp="children"
        loading={isLoading}
        value={employee?.guid}
        onChange={(value) => {
          const foundEmployee = data?.data?.find((c) => c.guid === value);

          if (foundEmployee) {
            onChange({
              guid: foundEmployee.guid as string,
              name: foundEmployee.name,
            });
          }
        }}
        options={data?.data?.map((employee) => ({
          label: employee.name,
          value: employee.guid,
        }))}
        filterOption={(input, option) =>
          includesIgnoreDiacritics(option?.label ?? '', input)
        }
        onSearch={(value) => debouncedSearch(value)}
      />
    </Container>
  );
};
