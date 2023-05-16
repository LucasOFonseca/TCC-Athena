import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginPageContent } from './components/LoginPageContent';

export default function Home() {
  const token = cookies().get('alohomora');

  if (token) redirect('/panel');

  return <LoginPageContent />;
}
