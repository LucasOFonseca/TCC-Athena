import styled from 'styled-components';

const Container = styled.main`
  margin: 1rem 0;
  padding: 0 2.5rem;
`;

interface PrintContentProps {
  children?: React.ReactNode;
}

export const PrintContent: React.FC<PrintContentProps> = ({ children }) => {
  return <Container>{children}</Container>;
};
