import { SideBar } from './components/SideBar';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideBar />

      <main style={{ margin: '64px 0 0 260px', padding: 16 }}>{children}</main>
    </>
  );
}
