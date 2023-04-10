'use client';

import { MenuOutlined } from '@ant-design/icons';
import { useSideBarController } from '@stores/useSideBarController';
import { Button } from 'antd';
import styled from 'styled-components';

const Container = styled.header`
  display: flex;
  align-items: center;
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

  @media (min-width: 900px) {
    display: none;
  }
`;

export const Header: React.FC = () => {
  const { handleOpen } = useSideBarController();

  return (
    <Container>
      <OpenSideBarButton type="text" onClick={handleOpen}>
        <MenuOutlined />
      </OpenSideBarButton>
    </Container>
  );
};
