import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: none;
  font-size: 0.875rem;
  font-family: 'Open Sans', sans-serif !important;
  height: 100vh;

  @media print {
    display: flex;
    flex-direction: column;
  }
`;

interface PrintContainerProps {
  ref?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
}

const PrintContainer: React.FC<PrintContainerProps> = forwardRef(
  ({ children }, ref) => {
    return <Container ref={ref}>{children}</Container>;
  }
);

PrintContainer.displayName = 'PrintContainer';

export { PrintContainer };
