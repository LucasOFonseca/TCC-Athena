import { calculateFinalGrade, formatGradeValue } from '@helpers/utils';
import { Form, FormInstance, InputNumber } from 'antd';
import styled from 'styled-components';
import { StudentsGradesForm } from '../../StudentGradesForm';

const Body = styled.tbody`
  tr {
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }

    td {
      .ant-form-item {
        margin-bottom: 0;
      }
    }

    td:first-of-type {
      text-align: left;
      font-weight: 600;
    }

    td:last-of-type {
      font-weight: 700;
    }
  }
`;

interface TableBodyProps {
  form: FormInstance<StudentsGradesForm>;
}

export const TableBody: React.FC<TableBodyProps> = ({ form }) => {
  const { setFieldValue } = form;

  const grades = Form.useWatch('grades', form);

  return (
    <Body>
      <Form.List name="grades">
        {(fields) => (
          <>
            {fields.map(({ key: gradeKey, name }, gradeIndex) => (
              <tr key={gradeKey}>
                <td>{grades[gradeIndex].studentName}</td>

                <Form.List name={[name, 'gradeItems']}>
                  {(fields) => (
                    <>
                      {fields.map(({ key, ...field }, index) => (
                        <td key={key}>
                          <Form.Item
                            required
                            {...field}
                            name={[field.name, 'value']}
                          >
                            <InputNumber
                              size="middle"
                              min={0}
                              max={
                                grades[gradeIndex].gradeItems[index].maxValue
                              }
                              style={{ width: 65 }}
                              decimalSeparator=","
                              onBlur={() => {
                                setFieldValue(
                                  ['grades', gradeIndex, 'finalValue'],
                                  calculateFinalGrade(
                                    grades[gradeIndex].gradeItems
                                  )
                                );
                              }}
                            />
                          </Form.Item>
                        </td>
                      ))}
                    </>
                  )}
                </Form.List>

                <td>{formatGradeValue(grades[gradeIndex].finalValue)}</td>
              </tr>
            ))}
          </>
        )}
      </Form.List>
    </Body>
  );
};
