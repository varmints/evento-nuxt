import type { ValidationError } from 'yup'
import type { EventSchemaType } from '../../utils/schemas/event-schema'
import dbConnect from '../../utils/db'
import { handleApiError } from '../../utils/error-handler'
import { checkUserSession } from '../../utils/index'
import UserEvent from '../../utils/models/user-event'
import { EventSchema } from '../../utils/schemas/event-schema'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    const body = await readBody<EventSchemaType>(event)
    const session = await checkUserSession(event)

    // Validate request body
    try {
      await EventSchema.validate(body, { abortEarly: false })
    }
    catch (e) {
      const validationError = e as ValidationError
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: validationError.errors,
      })
    }

    // create new event
    const userEvent = new UserEvent({
      ...body,
      owner: session.id,
    })
    await userEvent.save()
    return { status: 201, message: 'Event created successfuly' }
  }
  catch (error) {
    handleApiError(error)
  }
})
