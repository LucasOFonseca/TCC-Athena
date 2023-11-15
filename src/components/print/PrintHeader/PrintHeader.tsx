import dayjs from 'dayjs';
import styled from 'styled-components';

const Header = styled.header`
  padding: 1rem 1rem 0.5rem;
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

export const PrintHeader: React.FC = () => {
  return (
    <Header>
      <img src="/svg/colored-logo.svg" alt="" />

      <p>{dayjs().format('DD [de] MMMM [de] YYYY, HH:mm')}</p>
    </Header>
  );
};
