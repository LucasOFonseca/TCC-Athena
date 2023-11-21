import { MoreOutlined } from '@ant-design/icons';
import { employeeService } from '@services/employee';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import { AttendanceDialogForm } from '../../attendances/components/AttendanceDialogForm';

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const PeriodCard = styled(Card)`
  width: 325px;

  .ant-card-head {
    min-height: unset;
    padding: 8px 16px;
  }
`;

export const EmployeePeriodsSection: React.FC = () => {
  const { push } = useRouter();

  const { data } = useQuery(['employee', 'periods'], {
    queryFn: () => employeeService.getPeriods(),
    staleTime: Infinity,
  });

  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');

  const handleOpenAttendanceForm = (
    periodGuid: string,
    disciplineGuid: string
  ) => {
    setSelectedPeriod(periodGuid);
    setSelectedDiscipline(disciplineGuid);
    setShowAttendanceForm(true);
  };

  const handleCloseAttendanceForm = () => {
    setSelectedPeriod('');
    setSelectedDiscipline('');
    setShowAttendanceForm(false);
  };

  return (
    <>
      <AttendanceDialogForm
        open={showAttendanceForm}
        selectedPeriod={selectedPeriod}
        selectedDiscipline={selectedDiscipline}
        onClose={handleCloseAttendanceForm}
      />

      <h5 style={{ marginTop: 32 }}>Períodos vigentes</h5>

      <Container>
        {data?.map((period) => (
          <PeriodCard
            key={period.guid}
            hoverable
            extra={
              <Dropdown
                arrow
                placement="bottomLeft"
                menu={{
                  items: period.disciplines.map((discipline) => ({
                    key: discipline.guid,
                    label: discipline.name,
                    children: [
                      {
                        key: '1',
                        label: 'Atribuir notas',
                        onClick: () =>
                          push(
                            `/panel/grades/${period.guid}/${discipline.guid}`
                          ),
                      },
                      {
                        key: '2',
                        label: 'Registrar frequência',
                        onClick: () =>
                          handleOpenAttendanceForm(
                            period.guid,
                            discipline.guid
                          ),
                      },
                    ],
                  })),
                }}
              >
                <Button type="text" shape="circle" size="middle">
                  <MoreOutlined />
                </Button>
              </Dropdown>
            }
          >
            <p>{period.name}</p>
          </PeriodCard>
        ))}
      </Container>
    </>
  );
};
