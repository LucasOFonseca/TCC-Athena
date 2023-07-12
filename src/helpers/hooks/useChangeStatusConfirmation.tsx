import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GenericStatus } from '@athena-types/genericStatus';
import { Modal } from 'antd';

export function useChangeStatusConfirmation() {
  const { confirm } = Modal;

  const handleChangeStatus = (status: GenericStatus, onOk: () => void) => {
    confirm({
      centered: true,
      title: `Alterar status para ${
        status === GenericStatus.active ? '"inativo"' : '"ativo"'
      }?`,
      icon: <ExclamationCircleOutlined />,
      content: `Após confirmar o cadastro ficará ${
        status === GenericStatus.active
          ? 'indisponível para uso até que o status retorne para "ativo".'
          : 'disponível para uso.'
      }`,
      okText: 'Alterar',
      cancelButtonProps: {
        danger: true,
      },
      onOk,
    });
  };

  return handleChangeStatus;
}
