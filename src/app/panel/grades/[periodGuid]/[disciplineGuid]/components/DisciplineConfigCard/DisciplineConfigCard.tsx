import { EditOutlined } from '@ant-design/icons';
import { DisciplineGradeConfig } from '@athena-types/disciplineGradeConfig';
import { formatGradeValue } from '@helpers/utils';
import { Button, Card, Tooltip } from 'antd';
import { DisciplineConfigForm } from '../DisciplineConfigForm';

interface DisciplineConfigCardProps {
  disableEdit: boolean;
  config: DisciplineGradeConfig;
  periodGuid: string;
  disciplineGuid: string;
  showForm: boolean;
  toggleForm: () => void;
}

export const DisciplineConfigCard: React.FC<DisciplineConfigCardProps> = ({
  disableEdit,
  config,
  periodGuid,
  disciplineGuid,
  showForm,
  toggleForm,
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
        !disableEdit && !showForm ? (
          <Tooltip placement="bottom" title="Editar">
            <Button
              size="large"
              shape="circle"
              type="text"
              onClick={toggleForm}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        ) : null
      }
    >
      {showForm ? (
        <DisciplineConfigForm
          config={config}
          periodGuid={periodGuid}
          disciplineGuid={disciplineGuid}
          toggleForm={toggleForm}
        />
      ) : (
        config.gradeItems.map((item) => (
          <p key={item.name}>
            <strong>{item.name}:</strong> {formatGradeValue(item.maxValue)}
          </p>
        ))
      )}
    </Card>
  );
};
