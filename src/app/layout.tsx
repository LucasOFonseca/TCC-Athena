import { ClientSideAppProvider } from '@components/ClientSideAppProvider';
import { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const font = Open_Sans({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-family',
});

export const metadata: Metadata = {
  title: {
    default: 'Athena | Gestão Acadêmica',
    template: 'Athena | %s',
  },
  description:
    'App de gestão acadêmica desenvolvido como Trabalho de Conclusão do Curso de Sistemas de Informação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={font.className}>
      <body>
        <ClientSideAppProvider>{children}</ClientSideAppProvider>
      </body>
    </html>
  );
}
