import { StudentPeriodDetails } from '@athena-types/studentPeriod';
import { Print } from '@components/print';
import { formatGradeValue } from '@helpers/utils';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
`;

const Table = styled.table`
  margin-top: 32px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #000;

  th,
  td {
    padding: 8px 16px;
    text-align: center;

    &:first-of-type {
      text-align: left;
    }

    &:not(:first-of-type) {
      width: 100px;
    }

    &:not(:last-of-type) {
      border-right: 1px solid #000;
    }
  }

  th {
    border-bottom: 1px solid #000;
  }

  tr:not(:last-of-type) {
    td {
      border-bottom: 1px solid #000;
    }
  }
`;

interface PeriodDetailsPrintProps {
  ref?: React.Ref<HTMLDivElement>;
  studentName: string;
  data: StudentPeriodDetails;
}

const PeriodDetailsPrint: React.FC<PeriodDetailsPrintProps> = forwardRef(
  ({ studentName, data }, ref) => {
    return (
      <Print.Container ref={ref}>
        <Print.Header />
        <Print.Content>
          <h5 style={{ textAlign: 'center', textTransform: 'uppercase' }}>
            Histórico do aluno
          </h5>

          <InfoContainer>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              <p>
                <strong>Aluno:</strong> {studentName}
              </p>

              <p>
                <strong>Nº de matrícula:</strong> {data.enrollmentNumber}
              </p>
            </div>

            <hr />

            <p>
              <strong>Curso:</strong> {data.course}
            </p>

            <p>
              <strong>Matriz:</strong> {data.matrix}
            </p>

            <p>
              <strong>Módulo:</strong> {data.currentModuleName}
            </p>

            <p>
              <strong>Turma:</strong> {data.classId}
            </p>
          </InfoContainer>

          <Table>
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Faltas</th>
                <th>Nota</th>
              </tr>
            </thead>

            <tbody>
              {data.modules.map(({ guid, name, disciplines }) => (
                <React.Fragment key={guid}>
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      {name}
                    </td>
                  </tr>

                  {disciplines.map((discipline) => (
                    <tr key={discipline.guid}>
                      <td>{discipline.name}</td>

                      <td>{discipline.totalAbsences}</td>

                      <td>{formatGradeValue(discipline.finalGrade)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Print.Content>
        <Print.Footer />
      </Print.Container>
    );
  }
);

PeriodDetailsPrint.displayName = 'PeriodDetailsPrint';

export { PeriodDetailsPrint };
