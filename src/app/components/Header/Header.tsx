'use client';

import { MenuOutlined } from '@ant-design/icons';
import { ClientComponentLoader } from '@components/ClientComponentLoader';
import { useSideBarController } from '@stores/useSideBarController';
import { Button } from 'antd';
import styled from 'styled-components';
import { UserAccountDropdown } from './components/UserAccountDropdown';

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  position: fixed;
  top: 0;
  background-color: #34363d;
  z-index: 100;
  padding: 8px;
`;

const OpenSideBarButton = styled(Button)`
  color: white;

  &:hover {
    color: white !important;
  }

  &:active {
    color: white !important;
  }

  @media (min-width: var(--breakpoint-md)) {
    display: none;
  }
`;

const ButtonPlaceholder = styled.div`
  display: none;
  width: 48px;
  height: 40px;
`;

export const Header: React.FC = () => {
  const { handleOpen } = useSideBarController();

  return (
    <Container>
      <OpenSideBarButton type="text" onClick={handleOpen}>
        <MenuOutlined />
      </OpenSideBarButton>

      <ButtonPlaceholder />

      <ClientComponentLoader>
        <UserAccountDropdown />
      </ClientComponentLoader>
    </Container>
  );
};
