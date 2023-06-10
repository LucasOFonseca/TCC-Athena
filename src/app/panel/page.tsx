'use client';

import { BarChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const ContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #a0a0a0;
  margin-top: 32px;
`;

const CardPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 125px;
  width: 100%;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

export default function Panel() {
  return (
    <>
      <h4>Bem-vindo(a) ao Athena</h4>

      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
      </div>

      <ContentPlaceholder>
        <BarChartOutlined style={{ fontSize: 48 }} />
      </ContentPlaceholder>
    </>
  );
}
