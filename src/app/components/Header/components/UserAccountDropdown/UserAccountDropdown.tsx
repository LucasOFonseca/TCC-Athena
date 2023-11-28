import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useHydratePersistedState } from '@helpers/hooks';
import { useUser } from '@stores/useUser';
import { Button, Divider, Dropdown, theme } from 'antd';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { cloneElement } from 'react';
import styled from 'styled-components';

const { useToken } = theme;

const AccountButton = styled(Button)`
  color: #fff;

  &:hover {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  &:active {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.25) !important;
  }

  .ant-btn-icon {
    padding: 4px;
    background-color: #212330;
    border-radius: 50%;
  }
`;

export const UserAccountDropdown: React.FC = () => {
  const { push } = useRouter();
  const { token } = useToken();

  const userState = useHydratePersistedState(useUser());

  return (
    <Dropdown
      arrow
      placement="bottomCenter"
      dropdownRender={(menu) => (
        <div
          style={{
            backgroundColor: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ padding: 8 }}>
            <strong>Usuário</strong>
            <p>{userState?.user?.email}</p>
          </div>

          <Divider style={{ margin: 0 }} />

          {cloneElement(menu as React.ReactElement, {
            style: { minWidth: 200, width: '100%', boxShadow: 'none' },
          })}
        </div>
      )}
      menu={{
        items: [
          {
            key: '1',
            danger: true,
            icon: <LogoutOutlined />,
            label: 'Sair',
            onClick: () => {
              userState?.setUserInfo(undefined);

              deleteCookie('alohomora');

              push('/');
            },
          },
        ],
      }}
    >
      <AccountButton type="text" icon={<UserOutlined />}>
        {userState?.user?.name.split(' ')[0]}
      </AccountButton>
    </Dropdown>
  );
};
