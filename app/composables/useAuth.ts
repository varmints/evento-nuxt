import { useAuthStore } from '@/stores/user'

export function useAuth() {
  const toast = useToast()
  const { fetch: refreshSession } = useUserSession()
  const authStore = useAuthStore()

  const handleAuth = async (url: string, formData: any) => {
    try {
      const response = await $fetch<{ user: any }>(url, {
        method: 'POST',
        body: formData,
      })

      authStore.login(response.user)

      toast.add({
        title: 'Congratulation',
        description: 'Welcome !!!',
        color: 'success',
      })

      await refreshSession()
      await navigateTo('/')
      return true
    }
    catch (error: any) {
      if (error.statusCode === 400 && error.data?.data) {
        const validationErrors = error.data.data.errorsArray

        validationErrors.forEach((err: string) => {
          toast.add({
            title: 'Oops',
            description: err,
            color: 'error',
          })
        })
      }
      else {
        toast.add({
          title: 'Oops',
          description: error.data?.statusMessage || 'Sorry, something happened',
          color: 'error',
        })
      }
      return false
    }
  }

  const signUp = (formData: any) => handleAuth('/api/auth/sign-up', formData)
  const signIn = (formData: any) => handleAuth('/api/auth/sign-in', formData)

  return {
    signUp,
    signIn,
  }
}
