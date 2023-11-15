import styled from 'styled-components';

const Footer = styled.footer`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PrintFooter: React.FC = () => {
  return (
    <Footer>
      <p>
        Athena - Sistema de gestão acadêmica V
        {process.env.NEXT_PUBLIC_APP_VERSION}
      </p>
    </Footer>
  );
};
