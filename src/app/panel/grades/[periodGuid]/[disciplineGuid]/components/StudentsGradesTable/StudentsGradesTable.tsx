import { EditOutlined, PrinterFilled } from '@ant-design/icons';
import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { FilterItem } from '@athena-types/filterItem';
import { StudentGrade } from '@athena-types/sudentGade';
import { formatGradeValue } from '@helpers/utils';
import { periodService } from '@services/period';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { StudentsGradesPrint } from '../StudentsGradesPrint';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 8px;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  th,
  td {
    min-width: 115px;
    padding: 8px 16px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    border-top: 1px solid #f0f0f0;
    white-space: nowrap;

    &:first-of-type {
      width: 100%;
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }

      td:first-of-type {
        text-align: left;
        font-weight: 600;
      }

      td:last-of-type {
        font-weight: 700;
      }
    }
  }
`;

interface StudentsGradesTableProps {
  disableEdit: boolean;
  period: FilterItem;
  discipline: FilterItem;
  config: DisciplineGradeConfig;
  grades: StudentGrade[];
  onShowStudentsGradesForm: () => void;
}

export const StudentsGradesTable: React.FC<StudentsGradesTableProps> = ({
  disableEdit,
  period,
  discipline,
  config,
  grades,
  onShowStudentsGradesForm,
}) => {
  const { data: enrollments } = useQuery({
    queryKey: ['periodEnrollments', period.guid],
    queryFn: () => periodService.getEnrollments(period.guid),
    staleTime: Infinity,
    enabled: grades.length === 0,
  });

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <StudentsGradesPrint
        ref={printRef}
        periodName={period.name}
        disciplineName={discipline.name}
        grades={grades}
        config={config}
        enrollments={enrollments}
      />

      <Header>
        <h5>Alunos</h5>

        {!disableEdit ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="text" icon={<PrinterFilled />} onClick={print}>
              Imprimir
            </Button>

            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={onShowStudentsGradesForm}
            >
              Atribuir notas
            </Button>
          </div>
        ) : null}
      </Header>

      <Table>
        <thead>
          <tr>
            <th />

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
    </>
  );
};
