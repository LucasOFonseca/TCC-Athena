import { StudentGradeStatus } from '@athena-types/studentPeriod';

interface StatusProps {
  label: string;
  color: string;
}

export const getStudentGradeStatusProps = (status: StudentGradeStatus) => {
  const props: Record<StudentGradeStatus, any> = {
    [StudentGradeStatus.pending]: {
      label: '-',
      color: 'inherit',
    },
    [StudentGradeStatus.fail]: {
      label: 'Reprovado',
      color: '#f5222d',
    },
    [StudentGradeStatus.pass]: {
      label: 'Aprovado',
      color: '#52c41a',
    },
  };

  return props[status];
};
