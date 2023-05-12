import { Employee, EmployeeRole } from '@athena-types/employee';
import { Checkbox, Form, FormInstance } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const StyledCheckboxGroup = styled(Checkbox.Group)`
  flex-direction: column;
  gap: 4px;

  label {
    margin: 0 !important;
  }
`;

interface EmployeeRolesStepProps {
  disabled: boolean;
  form: FormInstance<Employee>;
}

export const EmployeeRolesStep: React.FC<EmployeeRolesStepProps> = ({
  disabled,
  form,
}) => {
  const { getFieldValue, getFieldsValue } = form;

  const [selectedRoles, setSelectedRoles] = useState<EmployeeRole[]>(
    getFieldValue('roles') ?? []
  );

  return (
    <Form
      disabled={disabled}
      layout="vertical"
      size="middle"
      form={form}
      initialValues={getFieldsValue()}
      onValuesChange={(fields) => {
        setSelectedRoles(fields.roles);
      }}
    >
      <Form.Item
        required
        label="Selecione as atribuições do colaborador"
        name="roles"
        rules={[{ required: true, message: '' }]}
      >
        <StyledCheckboxGroup>
          <Checkbox
            disabled={selectedRoles.some(
              (role) =>
                role === EmployeeRole.coordinator ||
                role === EmployeeRole.secretary
            )}
            value={EmployeeRole.principal}
          >
            Diretor(a)
          </Checkbox>

          <Checkbox
            disabled={selectedRoles.some(
              (role) =>
                role === EmployeeRole.principal ||
                role === EmployeeRole.secretary
            )}
            value={EmployeeRole.coordinator}
          >
            Coordenador(a)
          </Checkbox>

          <Checkbox
            disabled={selectedRoles.some(
              (role) =>
                role === EmployeeRole.principal ||
                role === EmployeeRole.coordinator
            )}
            value={EmployeeRole.secretary}
          >
            Secretário(a)
          </Checkbox>

          <Checkbox value={EmployeeRole.educator}>Professor(a)</Checkbox>
        </StyledCheckboxGroup>
      </Form.Item>
    </Form>
  );
};
