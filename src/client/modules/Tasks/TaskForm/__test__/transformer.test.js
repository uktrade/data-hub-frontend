import { formatDate, addMonths, addDays } from 'date-fns'

import { DATE_FORMAT_ISO } from '../../../../../client/utils/date-utils'
import { getDueDate } from '../transformers'

describe('getDueDate', () => {
  it('should return the transformed value for a custom date', () => {
    const customDate = { year: 2024, month: 12, day: 31 }
    const expectedTransformedValue = '2024-12-31'

    const result = getDueDate('custom', customDate)
    expect(result).to.equal(expectedTransformedValue)
  })

  it('should return the correct due date for the next month', () => {
    const today = new Date()
    const nextMonthDate = addMonths(today, 1)
    const formattedDate = formatDate(nextMonthDate, DATE_FORMAT_ISO)

    const result = getDueDate('month')
    expect(result).to.equal(formattedDate)
  })

  it('should return the correct due date for the next week', () => {
    const today = new Date()
    const nextWeekDate = addDays(today, 7)
    const formattedDate = formatDate(nextWeekDate, DATE_FORMAT_ISO)

    const result = getDueDate('week')
    expect(result).to.equal(formattedDate)
  })

  it('should return null for an unknown due date type', () => {
    const result = getDueDate('unknown')
    expect(result).to.be.null
  })
})
