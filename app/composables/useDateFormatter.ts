import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export function useDateFormatter() {
  function formatEventDate(date: any): string | null {
    if (!date) {
      return null
    }

    try {
      let dateObj: Date

      // Handle different date formats
      if (typeof date === 'string') {
        dateObj = new Date(date)
      }
      else if (date.month && date.day && date.year) {
        // Handle {month, day, year} object
        dateObj = new Date(date.year, date.month - 1, date.day)
      }
      else {
        return null
      }

      // Check if date is valid
      if (Number.isNaN(dateObj.getTime())) {
        return null
      }

      // Format using date-fns with Polish locale
      return format(dateObj, 'dd MMM yyyy', { locale: pl })
    }
    catch {
      return null
    }
  }

  return {
    formatEventDate,
  }
}
