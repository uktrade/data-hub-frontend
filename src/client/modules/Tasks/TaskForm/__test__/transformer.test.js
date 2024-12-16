import { format, addMonths, addDays } from 'date-fns'

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
    const formattedDate = format(nextMonthDate, 'yyyy-MM-dd')

    const result = getDueDate('month')
    expect(result).to.equal(formattedDate)
  })

  it('should return the correct due date for the next week', () => {
    const today = new Date()
    const nextWeekDate = addDays(today, 7)
    const formattedDate = format(nextWeekDate, 'yyyy-MM-dd')

    const result = getDueDate('week')
    expect(result).to.equal(formattedDate)
  })
})
