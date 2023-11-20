import { StudentPeriodMatrixModule } from '@athena-types/studentPeriod';
import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  margin-top: 16px;
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

    &:last-of-type {
      width: 150px;
    }
  }
`;

const ModuleCell = styled.td`
  text-align: center !important;
  font-weight: 700;
  background-color: #f0f0f0;
`;

interface PeriodMatrixModulesTableProps {
  totalWorkload: number;
  modules: StudentPeriodMatrixModule[];
}

export const PeriodMatrixModulesTable: React.FC<
  PeriodMatrixModulesTableProps
> = ({ totalWorkload, modules }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Disciplina</th>
          <th>Carga horária</th>
        </tr>
      </thead>

      <tbody>
        {modules.map((module) => (
          <React.Fragment key={module.guid}>
            <tr>
              <ModuleCell colSpan={2}>{module.name}</ModuleCell>
            </tr>

            {module.disciplines.map((discipline) => (
              <tr key={discipline.guid}>
                <td>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    {discipline.name}

                    <span style={{ color: '#808080' }}>
                      {discipline.syllabus}
                    </span>
                  </div>
                </td>

                <td>
                  {discipline.workload}{' '}
                  {discipline.workload === 1 ? 'h' : 'hrs'}
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}

        <tr>
          <td
            style={{
              textAlign: 'right',
              fontWeight: 700,
              backgroundColor: '#f0f0f0',
            }}
          >
            Carga horária total:
          </td>

          <td style={{ fontWeight: 700, backgroundColor: '#f0f0f0' }}>
            {totalWorkload} {totalWorkload === 1 ? 'h' : 'hrs'}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
