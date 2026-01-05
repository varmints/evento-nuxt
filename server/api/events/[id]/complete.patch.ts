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

    // Update event status to completed
    const updateEvent = await UserEvent.findOneAndUpdate({
      _id: eventId,
      owner: session.id,
    }, { status: 'completed' })

    if (!updateEvent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found or you are not the owner',
      })
    }

    return { message: 'Success' }
  }
  catch (error) {
    handleApiError(error)
  }
})
