import styled from 'styled-components';

const Container = styled.main`
  flex: 1;
  margin: 1rem 0;
  padding: 0 0.5rem;
`;

interface PrintContentProps {
  children?: React.ReactNode;
}

export const PrintContent: React.FC<PrintContentProps> = ({ children }) => {
  return <Container>{children}</Container>;
};
