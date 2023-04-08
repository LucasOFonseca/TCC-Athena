import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UseCounterState {
  counter: number;
  increment: () => void;
}

export const useCounter = create(
  persist<UseCounterState>(
    (set) => ({
      counter: 0,
      increment: () =>
        set((state) => ({
          counter: state.counter + 1,
        })),
    }),
    { name: 'useCounter' }
  )
);
