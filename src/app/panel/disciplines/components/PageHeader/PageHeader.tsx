'use client';

import { SearchOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { Input, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

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
  statusFilter: GenericStatus | 'all';
  onChangeStatusFilter: (status: GenericStatus | 'all') => void;
  onChangeSearch: (search: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  statusFilter,
  onChangeStatusFilter,
  onChangeSearch,
}) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value === '' || value.length >= 3) {
        onChangeSearch(value);
      }
    }, 500),
    []
  );

  return (
    <Container>
      <h4>Disciplinas</h4>

      <ClientComponentLoader
        loader={
          <FiltersContainer>
            <Skeleton height={40} />
            <Skeleton height={40} />
          </FiltersContainer>
        }
      >
        <FiltersContainer>
          <Input
            placeholder="Pesquisar disciplina"
            prefix={<SearchOutlined />}
            onChange={(e) => debouncedSearch(e.target.value)}
          />

          <Select
            defaultValue="all"
            value={statusFilter}
            onChange={(value) => onChangeStatusFilter(value as GenericStatus)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: GenericStatus.active, label: 'Ativos' },
              { value: GenericStatus.inactive, label: 'Inativos' },
            ]}
          />
        </FiltersContainer>
      </ClientComponentLoader>
    </Container>
  );
};
