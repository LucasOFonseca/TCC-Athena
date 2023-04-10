'use client';

import styled from 'styled-components';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';

const Main = styled.main`
  display: flex;
  justify-content: center;
  margin: 64px 0 0 260px;
  padding: 16px;

  @media (max-width: 900px) {
    margin: 64px 0 0;
    padding: 16px 8px;
  }

  & > div {
    width: 100%;
    max-width: 1360px;
  }
`;

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SideBar />

      <Main>
        <div>{children}</div>
      </Main>
    </>
  );
}
