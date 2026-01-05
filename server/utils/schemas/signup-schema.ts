import type { InferType } from 'yup'
import { object, string } from 'yup'

// Define validation schema
export const SignUpSchema = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .required('Password is required'),
})

export type SignUpSchemaType = InferType<typeof SignUpSchema>
