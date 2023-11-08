import { EditOutlined } from '@ant-design/icons';
import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { Button, Card, Tooltip } from 'antd';

interface DisciplineConfigCardProps {
  config: DisciplineGradeConfig;
}

export const DisciplineConfigCard: React.FC<DisciplineConfigCardProps> = ({
  config,
}) => {
  return (
    <Card
      style={{
        width: '100%',
        maxWidth: 670,
        marginTop: 32,
      }}
      title="Distribuição de pontos"
      extra={
        <Tooltip placement="bottom" title="Editar">
          <Button size="large" shape="circle" type="text">
            <EditOutlined />
          </Button>
        </Tooltip>
      }
    >
      {config.gradeItems.map((item) => (
        <p key={item.name}>
          <strong>{item.name}:</strong> {item.maxValue}
        </p>
      ))}
    </Card>
  );
};
