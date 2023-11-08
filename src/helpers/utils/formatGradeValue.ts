export function formatGradeValue(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
