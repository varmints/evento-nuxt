import dbConnect from '../../utils/db'
import { handleApiError } from '../../utils/error-handler'
import { checkUserSession } from '../../utils/index'
import UserEvent from '../../utils/models/user-event'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    const session = await checkUserSession(event)

    /// FAKE ERROR
    // throw createError({
    //     statusCode: 401,
    //     statusMessage:  'Fake error message',
    // })

    const events = await UserEvent.find({
      owner: session.id,
    }).sort({ createdAt: -1 }).populate('owner')
    return events
  }
  catch (error) {
    handleApiError(error)
  }
})
