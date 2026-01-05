import type { SessionUser } from '../utils/index'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session?.user as SessionUser | undefined

  if (user) {
    event.context.auth = { user }
  }
  else {
    event.context.auth = { user: null }
  }
})
