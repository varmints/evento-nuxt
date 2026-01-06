import type { ValidationError } from 'yup'
import type { EventSchemaType } from '../../../utils/schemas/event-schema'
import dbConnect from '../../../utils/db'
import { handleApiError } from '../../../utils/error-handler'
import { checkUserSession } from '../../../utils/index'
import UserEvent from '../../../utils/models/user-event'
import { EventSchema } from '../../../utils/schemas/event-schema'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    const body = await readBody<EventSchemaType>(event)
    const session = await checkUserSession(event)
    const eventId = getRouterParam(event, 'id')

    if (!eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Event ID required',
      })
    }

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

    // Update the event
    const updatedEvent = await UserEvent.findOneAndUpdate({
      _id: eventId,
      owner: session.id,
    }, {
      title: body.title,
      content: body.content,
      date: body.date ?? null,
    }, { new: true })

    if (!updatedEvent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found or you are not the owner',
      })
    }

    return updatedEvent
  }
  catch (error) {
    handleApiError(error)
  }
})
