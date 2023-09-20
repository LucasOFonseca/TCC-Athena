import {
  CheckOutlined,
  CloseOutlined,
  FileExclamationOutlined,
  FormOutlined,
  ForwardOutlined,
  InfoOutlined,
} from '@ant-design/icons';
import { PeriodStatus } from '@athena-types/period';

interface StatusProps {
  translated: string;
  icon: JSX.Element;
  color: string;
}

export function getPeriodStatusProps(status: PeriodStatus) {
  const props: { [key: string]: StatusProps } = {
    [PeriodStatus.draft]: {
      translated: 'Rascunho',
      icon: <FileExclamationOutlined />,
      color: '#c4c4c4',
    },
    [PeriodStatus.notStarted]: {
      translated: 'Não iniciado',
      icon: <InfoOutlined />,
      color: '#1A87C4',
    },
    [PeriodStatus.openForEnrollment]: {
      translated: 'Matrículas abertas',
      icon: <FormOutlined />,
      color: '#FAAD14',
    },
    [PeriodStatus.inProgress]: {
      translated: 'Em andamento',
      icon: <ForwardOutlined />,
      color: '#5B1AC4',
    },
    [PeriodStatus.finished]: {
      translated: 'Finalizado',
      icon: <CheckOutlined />,
      color: '#52C41A',
    },
    [PeriodStatus.canceled]: {
      translated: 'Cancelado',
      icon: <CloseOutlined />,
      color: '#FF4D4F',
    },
  };

  return props[status];
}
