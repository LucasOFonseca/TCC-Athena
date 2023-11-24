import { StudentAvailableCertificate } from '@athena-types/studentAvailableCertificate';
import { Card } from 'antd';
import styled from 'styled-components';

const Container = styled(Card)`
  width: 100%;
  max-width: 325px;

  .ant-card-head {
    min-height: unset !important;
    padding: 8px 16px;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

interface CertificateCardProps {
  certificate: StudentAvailableCertificate;
  print: (certificate: StudentAvailableCertificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  print,
}) => {
  return (
    <Container hoverable onClick={() => print(certificate)}>
      <p>{certificate.name}</p>
    </Container>
  );
};
