'use client';

import { PeriodStatus } from '@athena-types/period';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { Select } from 'antd';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  h4 {
    min-width: max-content;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  gap: 16px;
  margin-left: 16px;

  & > span {
    width: 100%;
    max-width: 375px;
  }

  & > div {
    width: 100%;
    max-width: 210px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
    margin-left: 0;

    & > span {
      max-width: unset;
    }

    & > div {
      max-width: unset;
    }
  }
`;

interface PageHeaderProps {
  statusFilter: PeriodStatus | 'all';
}

export const PageHeader: React.FC<PageHeaderProps> = ({ statusFilter }) => {
  return (
    <Container>
      <h4>Frequências</h4>

      <ClientComponentLoader
        loader={
          <FiltersContainer>
            <Skeleton height={40} />
            <Skeleton height={40} />
          </FiltersContainer>
        }
      >
        <FiltersContainer>
          <Select
            defaultValue="all"
            value={statusFilter}
            options={[{ value: 'all', label: 'Todos' }]}
          />

          <Select
            defaultValue="all"
            value={statusFilter}
            options={[{ value: 'all', label: 'Todos' }]}
          />
        </FiltersContainer>
      </ClientComponentLoader>
    </Container>
  );
};
