import React from 'react';
import { forwardRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-size: 0.875rem;
`;

interface PrintContainerProps {
  children?: React.ReactNode;
}

export const PrintContainer: React.FC<PrintContainerProps> = React.forwardRef(
  ({ children }, ref) => {
    return <Container>{children}</Container>;
  },
);
