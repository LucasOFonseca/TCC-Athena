import { PlusOutlined } from '@ant-design/icons';
import { Matrix } from '@athena-types/matrix';
import { Button, Divider, Form, FormInstance, Space } from 'antd';
import { MatrixModuleCard } from '../MatrixModuleCard';

interface ModulesListProps {
  form: FormInstance<Matrix>;
}

export const ModulesList: React.FC<ModulesListProps> = ({ form }) => {
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
    </>
  );
};
