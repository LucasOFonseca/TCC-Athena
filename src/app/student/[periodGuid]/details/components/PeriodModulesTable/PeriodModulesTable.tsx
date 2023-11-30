import { InfoOutlined } from '@ant-design/icons';
import { StudentPeriodModule } from '@athena-types/studentPeriod';
import { formatGradeValue, getStudentGradeStatusProps } from '@helpers/utils';
import { Dropdown, theme } from 'antd';
import React from 'react';
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

interface PeriodModulesTableProps {
  modules: StudentPeriodModule[];
}

export const PeriodModulesTable: React.FC<PeriodModulesTableProps> = ({
  modules,
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
        {modules.map(({ guid, name, disciplines }) => (
          <React.Fragment key={guid}>
            <tr>
              <td
                colSpan={4}
                style={{
                  fontWeight: 700,
                  textAlign: 'center',
                  backgroundColor: '#f0f0f0',
                }}
              >
                {name}
              </td>
            </tr>

            {disciplines.map((discipline) => {
              const { label, color } = getStudentGradeStatusProps(
                discipline.status
              );

              return (
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

                  <td style={{ color }}>{label}</td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
};
