import styled from 'styled-components';

const Title = styled.h5`
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 32px;
`;

interface PrintTitleProps {
  children?: React.ReactNode;
}

export const PrintTitle: React.FC<PrintTitleProps> = ({ children }) => {
  return <Title>{children}</Title>;
};
