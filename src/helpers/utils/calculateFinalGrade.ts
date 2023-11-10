import { GradeItemType } from '@athena-types/disciplineGradeConfig';
import { StudentGradeItem } from '@athena-types/sudentGade';

export function calculateFinalGrade(gradeItems: StudentGradeItem[]) {
  const valuesToSum = gradeItems.filter(
    (item) => item.type === GradeItemType.sum
  );
  const valuesToAverage = gradeItems.filter(
    (item) => item.type === GradeItemType.average
  );

  const average =
    valuesToAverage.reduce((acc, item) => acc + item.value, 0) /
    valuesToAverage.length;

  const sum = valuesToSum.reduce((acc, item) => acc + item.value, 0);

  const total = sum + average;

  return Number((total > 10 ? 10 : total).toFixed(1));
}
