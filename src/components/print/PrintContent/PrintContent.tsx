import styled from 'styled-components';

const Container = styled.main`
  margin: 0.5rem 0;
`;

interface PrintContentProps {
  children?: React.ReactNode;
}

export const PrintContent: React.FC<PrintContentProps> = ({ children }) => {
  return <Container>{children}</Container>;
};
