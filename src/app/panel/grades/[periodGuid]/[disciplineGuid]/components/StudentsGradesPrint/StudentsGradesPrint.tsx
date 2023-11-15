import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { StudentEnrollment } from '@athena-types/studentEnrollment';
import { StudentGrade } from '@athena-types/sudentGade';
import { Print } from '@components/print';
import { formatGradeValue } from '@helpers/utils';
import { forwardRef } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border: 1px solid #000;
  margin-top: 0.5rem;

  th,
  td {
    min-width: 115px;
    padding: 0.25rem 0.5rem;

    &:not(:last-of-type) {
      border-right: 1px solid #000;
    }

    &:not(:first-of-type) {
      text-align: center;
    }
  }

  th {
    border-bottom: 1px solid #000;

    &:first-of-type {
      width: 100%;
      text-align: left;
    }
  }

  tbody {
    tr:not(:last-of-type) {
      td {
        border-bottom: 1px solid #000;
      }
    }
  }
`;

interface StudentsGradesPrintProps {
  ref?: React.Ref<HTMLDivElement>;
  periodName: string;
  disciplineName: string;
  grades: StudentGrade[];
  config: DisciplineGradeConfig;
  enrollments?: StudentEnrollment[];
}

const StudentsGradesPrint: React.FC<StudentsGradesPrintProps> = forwardRef(
  ({ periodName, disciplineName, grades, config, enrollments }, ref) => {
    return (
      <Print.Container ref={ref}>
        <Print.Header />

        <Print.Content>
          <h5
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.125rem',
              textTransform: 'uppercase',
            }}
          >
            registro de notas
          </h5>

          <div style={{ margin: '2rem 0', fontSize: '1rem' }}>
            <p>
              <strong>Período:</strong> {periodName}
            </p>

            <p style={{ marginTop: '0.5rem' }}>
              <strong>Disciplina:</strong> {disciplineName}
            </p>
          </div>

          <Table>
            <thead>
              <tr>
                <th>Aluno</th>

                {config.gradeItems.map((item, index) => (
                  <th key={item.name}>{index === 0 ? 'VA' : item.name}</th>
                ))}

                <th>Nota final</th>
              </tr>
            </thead>

            <tbody>
              {grades.length === 0
                ? enrollments?.map((enrollment) => (
                    <tr key={enrollment.studentGuid}>
                      <td>{enrollment.studentName}</td>

                      {config.gradeItems.map((item) => (
                        <td key={item.name}>-</td>
                      ))}

                      <td>-</td>
                    </tr>
                  ))
                : grades.map((grade) => (
                    <tr key={grade.guid}>
                      <td>{grade.studentName}</td>

                      {config.gradeItems.map((item) => {
                        const studentGrade = grade.gradeItems.find(
                          (gradeItem) => gradeItem.gradeItemGuid === item.guid
                        );

                        return (
                          <td key={item.guid}>
                            {studentGrade?.value
                              ? formatGradeValue(studentGrade.value)
                              : '0,0'}
                          </td>
                        );
                      })}

                      <td>{formatGradeValue(grade.finalValue)}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </Print.Content>
        <Print.Footer />
      </Print.Container>
    );
  }
);

StudentsGradesPrint.displayName = 'StudentsGradesPrint';

export { StudentsGradesPrint };
