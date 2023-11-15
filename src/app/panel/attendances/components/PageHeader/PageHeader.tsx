'use client';

import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { useEffect } from 'react';
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

  @media (max-width: 1100px) {
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

  @media (max-width: 1100px) {
    margin-left: 0;

    & > div {
      max-width: unset !important;
    }

    & > span {
      max-width: unset;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 8px;
  }
`;

interface PageHeaderProps {
  selectedPeriod: string;
  selectedDiscipline: string;
  handleChangeDiscipline: (guid: string, name: string) => void;
  handleChangePeriod: (guid: string, name: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  selectedPeriod,
  selectedDiscipline,
  handleChangeDiscipline,
  handleChangePeriod,
}) => {
  const { data: periods, isLoading: isLoadingPeriods } = useQuery(
    ['employee', 'periods'],
    {
      queryFn: () => employeeService.getPeriods(),
      staleTime: Infinity,
    }
  );

  const { data: disciplines, isLoading: isLoadingDisciplines } = useQuery(
    ['employee', 'periods', selectedPeriod, 'disciplines'],
    {
      queryFn: () => employeeService.getDisciplinesByPeriod(selectedPeriod),
      enabled: !!selectedPeriod,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (periods && periods.length > 0)
      handleChangePeriod(periods[0].guid, periods[0].name);
  }, [periods]);

  useEffect(() => {
    if (disciplines) {
      handleChangeDiscipline(disciplines[0].guid, disciplines[0].name);
    }
  }, [disciplines]);

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
            disabled={periods && periods.length === 0}
            loading={isLoadingPeriods}
            style={{ width: '100%', maxWidth: 400 }}
            value={selectedPeriod}
            options={periods?.map((period) => ({
              value: period.guid,
              label: period.name,
            }))}
            onChange={(_, { value, label }: any) =>
              handleChangePeriod(value, label)
            }
          />

          <Select
            disabled={periods && periods.length === 0}
            loading={isLoadingDisciplines}
            style={{ width: '100%', maxWidth: 250 }}
            value={selectedDiscipline}
            options={disciplines?.map((discipline) => ({
              value: discipline.guid,
              label: discipline.name,
            }))}
            onChange={(_, { value, label }: any) =>
              handleChangeDiscipline(value, label)
            }
          />
        </FiltersContainer>
      </ClientComponentLoader>
    </Container>
  );
};
