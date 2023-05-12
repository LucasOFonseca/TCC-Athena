'use client';

import { SquareLoader } from '@components/SquareLoader';
import { useProgressIndicator } from '@stores/useProgressIndicator';
import styled from 'styled-components';

const Backdrop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;

  p {
    font-size: 1.125rem;
    color: #fff;
  }
`;

export const FullScreenLoader: React.FC = () => {
  const { items } = useProgressIndicator();

  return (
    <>
      {items.length > 0 && (
        <Backdrop>
          <SquareLoader color="#bec4d4" />

          <p>{items[0].message}</p>
        </Backdrop>
      )}
    </>
  );
};
