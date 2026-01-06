import type { InferType } from 'yup'
import { date, object, string } from 'yup'

// Define validation schema
export const EventSchema = object({
  title: string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  content: string().required('Content is required').min(10, 'Content must be at least 10 characters'),
  date: date().nullable().typeError('Date must be a valid date').default(null),
})

export type EventSchemaType = InferType<typeof EventSchema>
