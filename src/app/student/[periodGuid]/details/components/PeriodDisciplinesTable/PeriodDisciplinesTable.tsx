import { InfoOutlined } from '@ant-design/icons';
import { StudentPeriodDiscipline } from '@athena-types/studentPeriod';
import { formatGradeValue } from '@helpers/utils';
import { Dropdown, theme } from 'antd';
import styled from 'styled-components';

const { useToken } = theme;

const Table = styled.table`
  margin-top: 48px;
  width: 100%;
  border-spacing: 0;

  th,
  td {
    padding: 8px 16px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;

    &:first-of-type {
      text-align: left;
    }

    &:not(:first-of-type) {
      width: 120px;
    }
  }
`;

interface PeriodDisciplinesTableProps {
  disciplines: StudentPeriodDiscipline[];
}

export const PeriodDisciplinesTable: React.FC<PeriodDisciplinesTableProps> = ({
  disciplines,
}) => {
  const { token } = useToken();

  return (
    <Table>
      <thead>
        <tr>
          <th>Disciplina</th>
          <th>Faltas</th>
          <th>Nota</th>
          <th>Situação</th>
        </tr>
      </thead>

      <tbody>
        {disciplines.map((discipline) => (
          <tr key={discipline.guid}>
            <td>{discipline.name}</td>

            <td>{discipline.totalAbsences}</td>

            <Dropdown
              arrow
              placement="bottomCenter"
              dropdownRender={() => (
                <div
                  style={{
                    backgroundColor: token.colorBgElevated,
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadowSecondary,
                    padding: 8,
                  }}
                >
                  {discipline.grades.map((grade) => (
                    <p key={grade.guid}>
                      <strong>{grade.name}:</strong>{' '}
                      {formatGradeValue(grade.value)}
                    </p>
                  ))}
                </div>
              )}
            >
              <td>
                <span style={{ position: 'relative' }}>
                  {formatGradeValue(discipline.finalGrade)}

                  <InfoOutlined
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -12,
                      color: '#1677ff',
                    }}
                  />
                </span>
              </td>
            </Dropdown>

            <td style={{ color: discipline.finalGrade > 6 ? 'green' : 'red' }}>
              {discipline.finalGrade > 6 ? 'Aprovado' : 'Reprovado'}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
