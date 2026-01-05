import type { H3Event } from 'h3'

export interface SessionUser {
  id: string
  email: string
}

declare module 'h3' {
  interface H3EventContext {
    auth?: {
      user: SessionUser | null
    }
  }
}

export async function checkUserSession(event: H3Event): Promise<SessionUser> {
  if (!event.context.auth || !event.context.auth.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unathorized',
    })
  }
  return event.context.auth.user
}
