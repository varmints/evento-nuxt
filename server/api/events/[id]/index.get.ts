import dbConnect from '../../../utils/db'
import { handleApiError } from '../../../utils/error-handler'
import { checkUserSession } from '../../../utils/index'
import UserEvent from '../../../utils/models/user-event'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    const session = await checkUserSession(event)
    const eventId = getRouterParam(event, 'id')

    if (!eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Event ID required',
      })
    }

    // Find the event
    const userEvent = await UserEvent.findOne({
      _id: eventId,
      owner: session.id,
    })

    if (!userEvent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found or you are not the owner',
      })
    }

    return userEvent
  }
  catch (error) {
    handleApiError(error)
  }
})
