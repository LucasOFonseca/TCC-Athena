import { StudentAvailableCertificate } from '@athena-types/studentAvailableCertificate';
import { useHydratePersistedState } from '@helpers/hooks';
import { useUser } from '@stores/useUser';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: calc(100% - 4rem);
  height: calc(100vh - 4rem);
  display: none;
  flex-direction: column;
  align-items: center;
  border: 2px double #212330;
  font-family: 'Times New Roman', 'serif';
  margin: 2rem;
  padding: 2rem;
  font-size: 1.125rem;

  p {
    text-align: center;
  }

  @media print {
    display: flex;
  }
`;

interface CertificatePrintProps {
  certificate?: StudentAvailableCertificate;
  clear: () => void;
}

export const CertificatePrint: React.FC<CertificatePrintProps> = ({
  certificate,
  clear,
}) => {
  const user = useHydratePersistedState(useUser(({ user }) => user));

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    documentTitle: `certificado_${certificate?.name
      .toLowerCase()
      .replace(/\s/g, '_')}_${certificate?.enrollmentNumber}`,
    content: () => printRef.current,
    onAfterPrint: clear,
  });

  useEffect(() => {
    if (certificate) print();
  }, [certificate]);

  return (
    <Container ref={printRef}>
      <img src="/svg/colored-logo.svg" alt="Athena logo" />

      <h1
        style={{
          textTransform: 'uppercase',
          marginTop: '1rem',
          marginBottom: '4rem',
        }}
      >
        certificado
      </h1>

      <p>Certificamos que</p>

      <i style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>
        {user?.name}
      </i>

      <p>
        portador(a) do CPF{' '}
        <strong>
          {user?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
        </strong>
        , matrícula n° <strong>{certificate?.enrollmentNumber}</strong>,
        concluiu com sucesso o curso{' '}
        <strong style={{ textTransform: 'uppercase' }}>
          {certificate?.name}
        </strong>{' '}
        com carga horária total de{' '}
        <strong>
          {certificate?.totalWorkload}{' '}
          {(certificate?.totalWorkload ?? 0) > 1 ? 'horas' : 'hora'}
        </strong>
        , finalizado em{' '}
        <strong>{dayjs(certificate?.finishDate).format('DD/MM/YYYY')}</strong>.
      </p>

      <i
        style={{
          position: 'absolute',
          bottom: '4rem',
          right: '4rem',
          minWidth: 250,
          borderTop: '1px solid #000',
          paddingTop: 8,
          textAlign: 'center',
        }}
      >
        {certificate?.principalName}
        <br />
        <strong>Diretor(a)</strong>
      </i>
    </Container>
  );
};
