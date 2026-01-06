/**
 * @file stores/user.ts
 * @desc 用户状态管理
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  real_name?: string
  email?: string
  phone?: string
  avatar?: string
  role?: string
  department_id?: number
}

interface UserState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token: string) => {
        set({ token })
      },

      setUser: (user: User) => {
        set({ user })
      },

      logout: () => {
        set({ token: null, user: null })
      },

      isLoggedIn: () => {
        return !!get().token
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
