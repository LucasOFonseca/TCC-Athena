import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DisciplineGradeConfig,
  GradeItemType,
} from '@athena-types/disciplineGradeConfig';
import { ErrorMessages } from '@athena-types/messages';
import { periodService } from '@services/period';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Select, Tooltip } from 'antd';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;

  & + & {
    margin-top: 16px;
  }

  .ant-form-item {
    margin: 0;
  }
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

interface DisciplineConfigFormProps {
  config: DisciplineGradeConfig;
  periodGuid: string;
  disciplineGuid: string;
  toggleForm: () => void;
}

export const DisciplineConfigForm: React.FC<DisciplineConfigFormProps> = ({
  config,
  periodGuid,
  disciplineGuid,
  toggleForm,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<DisciplineGradeConfig>();

  const { validateFields } = form;

  const items = Form.useWatch('gradeItems', form);

  const updateConfig = useMutation({
    mutationFn: (data: DisciplineGradeConfig) =>
      periodService.updateDisciplineGradeConfig(periodGuid, disciplineGuid, {
        ...data,
        guid: config.guid,
      }),
    onSuccess: (data: DisciplineGradeConfig) => {
      queryClient.setQueryData(
        [
          'employee',
          'periods',
          periodGuid,
          'disciplines',
          disciplineGuid,
          'config',
        ],
        data
      );
    },
  });

  const handleSubmit = () => {
    validateFields()
      .then((data) => {
        updateConfig.mutateAsync(data).then(toggleForm);
      })
      .catch(() => {
        Swal.fire('Ops!', ErrorMessages.MSGE01, 'error');
      });
  };

  return (
    <>
      <Form
        disabled={updateConfig.isLoading}
        size="middle"
        form={form}
        initialValues={config}
      >
        <Form.List name="gradeItems">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                if (index === 0) {
                  return (
                    <ItemContainer key={field.key}>
                      <strong style={{ width: '100%', maxWidth: 300 }}>
                        {items?.[index].name}:
                      </strong>

                      <Form.Item required name={[field.name, 'maxValue']}>
                        <InputNumber
                          placeholder="Valor"
                          min={0.1}
                          max={10}
                          decimalSeparator=","
                          style={{ width: 75 }}
                        />
                      </Form.Item>
                    </ItemContainer>
                  );
                }

                return (
                  <ItemContainer key={field.key}>
                    <Form.Item
                      required
                      name={[field.name, 'name']}
                      rules={[
                        { required: true, message: '' },
                        {
                          type: 'string',
                          min: 3,
                          message: ErrorMessages.MSGE08,
                        },
                        {
                          type: 'string',
                          max: 120,
                          message: ErrorMessages.MSGE09,
                        },
                      ]}
                      style={{ width: '100%', maxWidth: 300 }}
                    >
                      <Input placeholder="Nome" />
                    </Form.Item>

                    <Form.Item required name={[field.name, 'maxValue']}>
                      <InputNumber
                        placeholder="Valor"
                        min={0.1}
                        max={10}
                        decimalSeparator=","
                        style={{ width: 75 }}
                      />
                    </Form.Item>

                    <Form.Item
                      required
                      name={[field.name, 'type']}
                      style={{ width: '100%', maxWidth: 160 }}
                    >
                      <Select
                        placeholder="Tipo"
                        options={[
                          { value: GradeItemType.sum, label: 'Adicionar' },
                          {
                            value: GradeItemType.average,
                            label: 'Incluir na média',
                          },
                        ]}
                      />
                    </Form.Item>

                    <Tooltip placement="bottom" title="Remover">
                      <Button
                        shape="circle"
                        type="text"
                        onClick={() => remove(index)}
                      >
                        <MinusCircleOutlined />
                      </Button>
                    </Tooltip>
                  </ItemContainer>
                );
              })}

              <Button
                block
                type="text"
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
                onClick={() => add()}
              >
                Novo item
              </Button>
            </>
          )}
        </Form.List>
      </Form>

      <Footer>
        <Button danger disabled={updateConfig.isLoading} onClick={toggleForm}>
          Cancelar
        </Button>

        <Button
          type="primary"
          loading={updateConfig.isLoading}
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </Footer>
    </>
  );
};
