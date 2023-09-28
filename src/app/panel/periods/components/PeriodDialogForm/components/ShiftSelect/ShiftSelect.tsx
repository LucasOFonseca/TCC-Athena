'use client';

import { GenericStatus } from '@athena-types/genericStatus';
import { PeriodForm } from '@athena-types/period';
import { Shift } from '@athena-types/shift';
import { translateShift } from '@helpers/utils';
import { shiftService } from '@services/shift';
import { useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Select } from 'antd';
import { useEffect, useState } from 'react';

interface ShiftSelectProps {
  form: FormInstance<PeriodForm>;
}

export const ShiftSelect: React.FC<ShiftSelectProps> = ({ form }) => {
  const { getFieldValue, setFieldValue } = form;

  const [shift, setShift] = useState<Shift>();

  const { data, isLoading } = useQuery(['shifts'], {
    queryFn: () => shiftService.getAll(),
    staleTime: Infinity,
  });

  useEffect(() => {
    const value = getFieldValue('shiftGuid');
    if (value) {
      const shift = data?.find((shift) => shift.guid === value);

      if (shift) setShift(shift);
    }
  }, []);

  return (
    <Form.Item label="Turno" name="shiftGuid">
      <Select
        size="large"
        placeholder="Matutino"
        optionFilterProp="children"
        loading={isLoading}
        value={shift?.shift}
        onChange={(value) => {
          const foundShift = data?.find((s) => s.guid === value);

          setShift(foundShift);
          setFieldValue('shiftGuid', foundShift?.guid);
        }}
        options={data
          ?.filter((s) => s.status === GenericStatus.active)
          .map((s) => ({
            label: translateShift(s.shift),
            value: s.guid,
          }))}
      />
    </Form.Item>
  );
};
