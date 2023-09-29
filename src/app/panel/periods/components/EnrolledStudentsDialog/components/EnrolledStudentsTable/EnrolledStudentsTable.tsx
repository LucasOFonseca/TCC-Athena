import { ExclamationCircleOutlined } from '@ant-design/icons';
import { StudentEnrollment } from '@athena-types/studentEnrollment';
import { periodService } from '@services/period';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import styled from 'styled-components';
import { EnrolledStudentsTableLine } from './components/EnrolledStudentsTableLine';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 24px;
  border-radius: 8px;
  background-color: #fff;

  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15));
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  thead {
    tr {
      th {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.88);
        padding: 8px;
        text-align: start;
        text-transform: capitalize;
        background-color: #fafafa;
        border-bottom: 1px solid #f0f0f0;

        &:not(:last-of-type) {
          position: relative;

          &:after {
            content: '';
            position: absolute;
            width: 1px;
            height: 50%;
            right: 0;
            top: 25%;
            background-color: #f0f0f0;
          }
        }

        &:first-of-type,
        &:nth-of-type(2) {
          width: 65px;
          text-align: center;
        }
      }
    }
  }
`;

interface EnrolledStudentsTableProps {
  readOnly: boolean;
  periodGuid: string;
  enrollments: StudentEnrollment[];
}

export const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
  readOnly,
  periodGuid,
  enrollments,
}) => {
  const { confirm } = Modal;
  const queryClient = useQueryClient();

  const cancelEnrollment = useMutation({
    mutationFn: (enrollmentGuid: string) =>
      periodService.cancelEnrollment(periodGuid, enrollmentGuid),
    onSuccess: () => {
      queryClient.invalidateQueries(['periodEnrollments', periodGuid]);
    },
  });

  const handleCancelEnrollment = (guid: string) => {
    confirm({
      centered: true,
      title: 'Deseja remover a matrícula?',
      icon: <ExclamationCircleOutlined />,
      content: 'Após confirmar, a matrícula será removida!',
      okText: 'Confirmar',
      cancelText: 'Voltar',
      cancelButtonProps: {
        danger: true,
      },
      onOk: () => cancelEnrollment.mutate(guid),
    });
  };
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th />
            <th>Nº</th>
            <th>Matrícula</th>
            <th>Aluno</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((enrollment, index) => (
            <EnrolledStudentsTableLine
              key={enrollment.guid}
              readOnly={readOnly}
              index={index}
              enrollment={enrollment}
              onCancelEnrollment={() => handleCancelEnrollment(enrollment.guid)}
            />
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
