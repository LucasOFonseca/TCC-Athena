import { StudentPeriodMatrix } from '@athena-types/studentPeriod';
import { Print } from '@components/print';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { PeriodMatrixModulesTable } from '../PeriodMatrixModulesTable';

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

interface PeriodMatrixPrintProps {
  ref?: React.Ref<HTMLDivElement>;
  data: StudentPeriodMatrix;
}

const PeriodMatrixPrint: React.FC<PeriodMatrixPrintProps> = forwardRef(
  ({ data }, ref) => {
    return (
      <Print.Container ref={ref}>
        <Print.Header />

        <Print.Content>
          <h5 style={{ textAlign: 'center', textTransform: 'uppercase' }}>
            {data.course} - {data.name}
          </h5>

          <PeriodMatrixModulesTable
            totalWorkload={data.totalWorkload}
            modules={data.modules}
          />
        </Print.Content>

        <Print.Footer />
      </Print.Container>
    );
  }
);

PeriodMatrixPrint.displayName = 'PeriodMatrixPrint';

export { PeriodMatrixPrint };
