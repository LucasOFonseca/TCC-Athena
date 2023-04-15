import { ClientSideAppProvider } from '@components/ClientSideAppProvider';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const font = localFont({
  src: [
    {
      path: '../../public/fonts/OpenSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
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
