import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Matrix } from '@athena-types/matrix';
import {
  Button,
  Card,
  Form,
  FormInstance,
  FormListFieldData,
  Input,
  Space,
  Tooltip,
} from 'antd';
import styled from 'styled-components';
import { ModuleDisciplineSelect } from '../ModuleDisciplineSelect';

const Container = styled(Card)`
  font-size: 1rem;

  .ant-card-head {
    min-height: 50px;
    padding: 0;
  }

  .ant-card-body {
    padding: 8px 16px;
  }
`;

interface MatrixModuleCardProps {
  showRemove: boolean;
  index: number;
  form: FormInstance<Matrix>;
  moduleField: FormListFieldData;
  onRemove: () => void;
}

export const MatrixModuleCard: React.FC<MatrixModuleCardProps> = ({
  showRemove,
  index,
  form,
  moduleField,
  onRemove,
}) => {
  return (
    <Container
      title={
        <Form.Item name={[moduleField.name, 'name']} style={{ margin: 0 }}>
          <Input
            size="large"
            placeholder={`Módulo ${index + 1}`}
            bordered={false}
          />
        </Form.Item>
      }
      extra={
        showRemove ? (
          <Tooltip placement="bottom" title="Remover módulo">
            <Button
              danger
              size="large"
              shape="circle"
              type="text"
              style={{ margin: '4px 4px 4px 0' }}
              onClick={onRemove}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        ) : undefined
      }
    >
      <p style={{ fontWeight: 600, marginBottom: 8 }}>Disciplinas</p>

      <Form.List name={[moduleField.name, 'disciplines']}>
        {(fields, { add, remove }, { errors }) => (
          <>
            <Space
              direction="vertical"
              size="middle"
              style={{ width: '100%', marginBottom: 16 }}
            >
              {fields.map((field, index) => (
                <ModuleDisciplineSelect
                  key={field.key}
                  index={index}
                  form={form}
                  moduleField={moduleField}
                  field={field}
                  showRemove={fields.length > 1}
                  onRemove={() => remove(index)}
                />
              ))}
            </Space>

            <Form.Item>
              <Button
                block
                type="text"
                icon={<PlusOutlined />}
                onClick={() => add()}
              >
                Adicionar disciplina
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Container>
  );
};
