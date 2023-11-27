'use client';

import { StudentAvailableCertificate } from '@athena-types/studentAvailableCertificate';
import { studentService } from '@services/student';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useState } from 'react';
import { CertificateCard } from './components/CertificateCard';
import { CertificatePrint } from './components/CertificatePrint';

export default function CertificatesPage() {
  const { data } = useQuery(
    ['student', 'availableCertificates'],
    studentService.getAvailableCertificates
  );

  const [certificateToPrint, setCertificateToPrint] =
    useState<StudentAvailableCertificate>();

  return (
    <>
      <CertificatePrint
        certificate={certificateToPrint}
        clear={() => setCertificateToPrint(undefined)}
      />

      <h4 style={{ marginBottom: 32 }}>Certificados</h4>

      <Divider orientation="left" style={{ margin: 0 }} />

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {data?.map((certificate) => (
          <CertificateCard
            key={certificate.guid}
            certificate={certificate}
            print={setCertificateToPrint}
          />
        ))}
      </div>
    </>
  );
}
