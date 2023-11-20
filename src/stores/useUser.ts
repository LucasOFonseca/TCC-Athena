import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  name: string;
  email: string;
}

interface UserState {
  user?: UserInfo;
  setUserInfo: (user?: UserInfo) => void;
}

export const useUser = create(
  persist<UserState>(
    (set) => ({
      setUserInfo: (user) => set({ user }),
    }),
    {
      name: 'user',
    }
  )
);
