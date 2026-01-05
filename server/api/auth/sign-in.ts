import type { ValidationError } from 'yup'
import type { SignUpSchemaType } from '../../utils/schemas/signup-schema'
import bcrypt from 'bcryptjs'
import dbConnect from '../../utils/db'
import { handleApiError } from '../../utils/error-handler'
import userRepository from '../../utils/repositories/user-repository'
import { SignUpSchema } from '../../utils/schemas/signup-schema'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    const body = await readBody<SignUpSchemaType>(event)
    const { email, password } = body

    // Validate with YUP
    try {
      await SignUpSchema.validate(body, { abortEarly: false })
    }
    catch (e) {
      const validationError = e as ValidationError
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: {
          errorsArray: validationError.errors,
        },
      })
    }

    // Check if user exists
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'There is no user with this email',
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
      })
    }

    // Set a new session
    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    })

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
      },
    }
  }
  catch (error) {
    handleApiError(error)
  }
})
