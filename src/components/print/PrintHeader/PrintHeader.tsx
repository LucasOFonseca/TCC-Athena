import dayjs from 'dayjs';
import styled from 'styled-components';

const Header = styled.header`
  padding-bottom: 0.5rem;
  display: flex;
  align-items: end;
  justify-content: space-between;
  border-bottom: 1px solid #000;
`;

export const PrintHeader: React.FC = () => {
  return (
    <Header>
      <img src="/svg/colored-logo.svg" alt="" />

      <p>{dayjs().format('DD [de] MMMM [de] YYYY')}</p>
    </Header>
  );
};
