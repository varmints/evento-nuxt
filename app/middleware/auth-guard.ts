export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { loggedIn, fetch: fetchUser } = useUserSession()
  await fetchUser()

  if (!loggedIn.value) {
    return navigateTo('/auth/sign-up')
  }
})
