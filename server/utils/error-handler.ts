import { createError } from 'h3'

interface ErrorWithStatus {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: any
}

export function handleApiError(error: unknown): never {
  const typedError = error as ErrorWithStatus

  throw createError({
    statusCode: typedError.statusCode || 500,
    statusMessage: typedError.statusMessage || typedError.message || 'Internal Server Error',
    data: typedError.data || null,
  })
}
