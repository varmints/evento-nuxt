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

    // VALIDATE WITH YUP
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

    // CHECK if user exist
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await userRepository.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    })

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
