import { SquareLoader } from '@components/SquareLoader';

export default function Loading() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SquareLoader />
    </div>
  );
}
