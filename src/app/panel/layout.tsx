import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PanelLayout } from './components/PanelLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const accessToken = cookies().get('alohomora');

  if (!accessToken) redirect('/');

  return <PanelLayout>{children}</PanelLayout>;
}
