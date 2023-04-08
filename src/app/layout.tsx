import { ClientSideAppProvider } from '@components/ClientSideAppProvider';
import { Roboto } from 'next/font/google';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-family',
});

export const metadata = {
  title: 'Athena - Gestão Acadêmica',
  description:
    'App de gestão acadêmica desenvolvido como Trabalho de Conclusão do Curso de Sistemas de Informação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={roboto.className}>
      <body>
        <ClientSideAppProvider>{children}</ClientSideAppProvider>
      </body>
    </html>
  );
}
