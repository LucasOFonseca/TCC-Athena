import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { StudentGrade } from '@athena-types/sudentGade';
import { periodService } from '@services/period';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
import { TableBody } from './components/TableBody';

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
`;

export interface StudentsGradesForm {
  grades: StudentGrade[];
}

interface StudentGradesFormProps {
  periodGuid: string;
  disciplineGuid: string;
  config: DisciplineGradeConfig;
  grades: StudentGrade[];
  onCancel: () => void;
  onSubmitFinish: () => void;
}

export const StudentGradesForm: React.FC<StudentGradesFormProps> = ({
  periodGuid,
  disciplineGuid,
  config,
  grades,
  onCancel,
  onSubmitFinish,
}) => {
  const queryClient = useQueryClient();

  const { data: enrollments } = useQuery({
    queryKey: ['periodEnrollments', periodGuid],
    queryFn: () => periodService.getEnrollments(periodGuid ?? ''),
    staleTime: Infinity,
    enabled: !!periodGuid && grades.length === 0,
  });

  const updateGrades = useMutation({
    mutationFn: (data: StudentGrade[]) =>
      periodService.updateStudentsGrades(periodGuid, disciplineGuid, data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          'employee',
          'periods',
          periodGuid,
          'disciplines',
          disciplineGuid,
          'grades',
        ],
        data
      );
    },
  });

  const [form] = Form.useForm<StudentsGradesForm>();

  const { setFieldValue, validateFields } = form;

  const handleSubmit = () => {
    validateFields().then((data) => {
      updateGrades.mutateAsync(data.grades).then(onSubmitFinish);
    });
  };

  useEffect(() => {
    if (grades.length > 0) {
      setFieldValue(
        'grades',
        grades.map((grade) => ({
          ...grade,
          gradeItems: config.gradeItems.map((item) => ({
            name: item.name,
            gradeItemGuid: item.guid as string,
            maxValue: item.maxValue,
            type: item.type,
            value:
              grade.gradeItems.find((i) => i.gradeItemGuid === item.guid)
                ?.value ?? 0,
          })),
        }))
      );
    } else {
      const newGrades: StudentGrade[] =
        enrollments?.map((enrollment) => ({
          studentGuid: enrollment.studentGuid,
          studentName: enrollment.studentName,
          finalValue: 0,
          gradeItems: config.gradeItems.map((item) => ({
            name: item.name,
            gradeItemGuid: item.guid as string,
            maxValue: item.maxValue,
            type: item.type,
            value: 0,
          })),
        })) ?? [];

      setFieldValue('grades', newGrades);
    }
  }, [grades, enrollments]);

  return (
    <Form
      size="middle"
      form={form}
      initialValues={{
        grades: [],
      }}
    >
      <Header>
        <h5>Alunos</h5>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button danger disabled={updateGrades.isLoading} onClick={onCancel}>
            Cancelar
          </Button>

          <Button
            loading={updateGrades.isLoading}
            type="primary"
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
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

        <TableBody form={form} />
      </Table>
    </Form>
  );
};
