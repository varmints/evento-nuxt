import { defineStore } from 'pinia'

export interface User {
  _id: string
  email: string
  createdAt: string
}

interface UserState {
  isLoggedIn: boolean
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): UserState => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    async login(userData: User) {
      this.isLoggedIn = true
      this.user = userData
    },
    async logout() {
      const { clear } = useUserSession()

      try {
        await $fetch('/api/auth/log-out')
        await clear()
        this.isLoggedIn = false
        this.user = null
        await navigateTo('/auth/sign-up')
      }
      catch (error) {
        console.error(error)
      }
    },
  },
})
