import { AttendanceLogForm } from '@athena-types/attendanceLog';
import { Form, FormInstance, InputNumber } from 'antd';
import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  font-size: 1rem;

  th {
    font-weight: 600;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }

  th:first-of-type {
    width: 100%;
    text-align: left;
  }

  td {
    font-weight: 400;
    padding: 8px;
    border-bottom: 1px solid #ccc;

    & > div {
      margin: 0;
    }
  }

  td:nth-of-type(2) {
    text-align: center;
  }
`;

interface StudentsListProps {
  form: FormInstance<AttendanceLogForm>;
}

export const StudentsList: React.FC<StudentsListProps> = ({ form }) => {
  const studentAbsences = Form.useWatch('studentAbsences', form);
  const totalClasses = Form.useWatch('totalClasses', form);

  return (
    <Table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Presenças</th>
          <th>Faltas</th>
        </tr>
      </thead>

      <Form.List name="studentAbsences">
        {(fields) => (
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.key}>
                <td>{studentAbsences?.[index]?.studentName}</td>

                <td>
                  {totalClasses - studentAbsences?.[index]?.totalAbsences}
                </td>

                <td>
                  <Form.Item
                    required
                    {...field}
                    name={[field.name, 'totalAbsences']}
                  >
                    <InputNumber
                      size="middle"
                      min={0}
                      max={totalClasses}
                      style={{ width: 65 }}
                    />
                  </Form.Item>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Form.List>
    </Table>
  );
};
