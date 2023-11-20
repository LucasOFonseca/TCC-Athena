import { MoreOutlined } from '@ant-design/icons';
import { PeriodStatus } from '@athena-types/period';
import { StudentPeriod } from '@athena-types/studentPeriod';
import { getPeriodStatusProps } from '@helpers/utils';
import { Button, Card, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled(Card)`
  max-width: 325px;

  .ant-card-head {
    min-height: unset !important;
    padding: 8px 16px;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const StatusChip = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 0.875rem;
  background-color: ${({ color }) => color};
  padding: 4px;
  border-radius: 4px;
`;

interface PeriodCardProps {
  period: StudentPeriod;
}

export const PeriodCard: React.FC<PeriodCardProps> = ({ period }) => {
  const { push } = useRouter();

  const { color, icon, translated } = getPeriodStatusProps(period.status);

  return (
    <Container
      hoverable
      title={
        <StatusChip color={color}>
          {icon} {translated}
        </StatusChip>
      }
      extra={
        <Dropdown
          arrow
          placement="bottomLeft"
          menu={{
            items:
              period.status !== PeriodStatus.openForEnrollment
                ? [
                    {
                      key: '1',
                      label: 'Ver matriz',
                      onClick: () => push(`/student/${period.guid}/matrix`),
                    },
                    {
                      key: '2',
                      label: 'Histórico',
                      onClick: () => push(`/student/${period.guid}/details`),
                    },
                  ]
                : [
                    {
                      key: '1',
                      label: 'Ver matriz',
                      onClick: () => push(`/student/${period.guid}/matrix`),
                    },
                  ],
          }}
        >
          <Button size="middle" type="text" shape="circle">
            <MoreOutlined />
          </Button>
        </Dropdown>
      }
    >
      <p>{period.name}</p>
    </Container>
  );
};
