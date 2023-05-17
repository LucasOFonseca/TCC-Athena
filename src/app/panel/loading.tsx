import { SquareLoader } from '@components/SquareLoader';

export default function Loading() {
  return (
    <div
      style={{
        height: 'calc(100vh - 152px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SquareLoader />
    </div>
  );
}
