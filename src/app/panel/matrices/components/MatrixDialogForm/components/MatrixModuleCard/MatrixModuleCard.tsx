import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Matrix } from '@athena-types/matrix';
import { ErrorMessages } from '@athena-types/messages';
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
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
  const modules = Form.useWatch('modules', form);

  const totalModuleWorkload = modules?.[index].disciplines?.reduce(
    (acc, discipline) => acc + (discipline ? discipline.workload : 0),
    0
  );

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
              <DeleteOutlined rev="" />
            </Button>
          </Tooltip>
        ) : undefined
      }
    >
      <p style={{ fontWeight: 600, marginBottom: 8 }}>Disciplinas</p>

      <Form.List
        name={[moduleField.name, 'disciplines']}
        rules={[
          {
            validator: async (_, disciplines) => {
              if (!disciplines || disciplines.length < 1) {
                return Promise.reject(new Error(ErrorMessages.MSGE01));
              }
            },
          },
        ]}
      >
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
                  form={form}
                  moduleField={moduleField}
                  field={field}
                  showRemove={fields.length > 1}
                  onRemove={() => remove(index)}
                />
              ))}
            </Space>

            <Form.Item>
              <Form.ErrorList errors={errors} />

              <Button
                block
                type="text"
                icon={<PlusOutlined rev="" />}
                onClick={() => add()}
              >
                Adicionar disciplina
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {totalModuleWorkload ? (
        <Footer>
          <strong>Carga horária:</strong>{' '}
          <span>{totalModuleWorkload} horas</span>
        </Footer>
      ) : null}
    </Container>
  );
};
