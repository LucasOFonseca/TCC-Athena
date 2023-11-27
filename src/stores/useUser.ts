import { EmployeeRole } from '@athena-types/employee';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  guid: string;
  name: string;
  email: string;
  cpf: string;
  roles: EmployeeRole[];
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
