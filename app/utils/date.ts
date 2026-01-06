import { CalendarDate } from '@internationalized/date'

/**
 * Converts a date string to a CalendarDate object
 * @param dateValue - ISO date string or Date object
 * @returns CalendarDate or null if invalid
 */
export function stringDateToCalendarDate(dateValue: string | Date | null | undefined): CalendarDate | null {
  if (!dateValue)
    return null

  try {
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime()))
      return null

    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    )
  }
  catch (e) {
    console.error('Error parsing date:', dateValue, e)
    return null
  }
}
