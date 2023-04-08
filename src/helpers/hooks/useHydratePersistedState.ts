import { useEffect, useState } from 'react';

export function useHydratePersistedState<T>(persistedState: T) {
  const [state, setState] = useState<T>();

  useEffect(() => {
    setState(persistedState);
  }, [persistedState]);

  return state;
}
