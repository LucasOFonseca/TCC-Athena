import { PlusOutlined } from '@ant-design/icons';
import { Matrix } from '@athena-types/matrix';
import { Button, Divider, Form, FormInstance, Space } from 'antd';
import styled from 'styled-components';
import { MatrixModuleCard } from '../MatrixModuleCard';

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
`;

interface ModulesListProps {
  form: FormInstance<Matrix>;
}

export const ModulesList: React.FC<ModulesListProps> = ({ form }) => {
  const modules = Form.useWatch('modules', form);

  const totalWorkload = modules
    ?.map((module) => module?.disciplines)
    .flat()
    ?.reduce(
      (acc, discipline) => acc + (discipline ? discipline.workload : 0),
      0
    );

  return (
    <>
      <Divider
        orientation="left"
        style={{ fontSize: '1.125rem', fontWeight: 600 }}
      >
        Módulos
      </Divider>

      <Form.List name="modules">
        {(fields, { add, remove }) => (
          <>
            <Space
              direction="vertical"
              size="middle"
              style={{ width: '100%', marginBottom: 16 }}
            >
              {fields.map((field, index) => (
                <MatrixModuleCard
                  key={field.key}
                  form={form}
                  moduleField={field}
                  showRemove={fields.length > 1}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
            </Space>

            <Form.Item>
              <Button
                block
                type="text"
                icon={<PlusOutlined />}
                onClick={() => add({ disciplines: [{ name: '' }] })}
              >
                Novo módulo
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider />

      {totalWorkload ? (
        <Footer>
          <strong>Carga horária (total):</strong>{' '}
          <span>{totalWorkload} horas</span>
        </Footer>
      ) : null}
    </>
  );
};
