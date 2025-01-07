import { addDays, subDays, format } from 'date-fns'

import { validateIfDateInFuture } from '../validators'

describe('validateIfDateInFuture', () => {
  it('should return null for a date in the future (with day provided)', () => {
    const futureDate = addDays(new Date(), 10)
    const year = format(futureDate, 'yyyy')
    const month = format(futureDate, 'MM')
    const day = format(futureDate, 'dd')

    const result = validateIfDateInFuture({ year, month, day })
    expect(result).to.be.null
  })

  it('should return null for a date in the future (year and month only)', () => {
    const futureDate = addDays(new Date(), 40) // Ensures crossing month boundary
    const year = format(futureDate, 'yyyy')
    const month = format(futureDate, 'MM')

    const result = validateIfDateInFuture({ year, month })
    expect(result).to.be.null
  })

  it('should return error message for a past date (with day provided)', () => {
    const pastDate = subDays(new Date(), 10)
    const year = format(pastDate, 'yyyy')
    const month = format(pastDate, 'MM')
    const day = format(pastDate, 'dd')

    const result = validateIfDateInFuture({ year, month, day })
    expect(result).to.equal('Enter a date in the future')
  })

  it('should return error message for a past date (year and month only)', () => {
    const pastDate = subDays(new Date(), 40)
    const year = format(pastDate, 'yyyy')
    const month = format(pastDate, 'MM')

    const result = validateIfDateInFuture({ year, month })
    expect(result).to.equal('Enter a date in the future')
  })

  it('should handle edge cases correctly (today is not in the future)', () => {
    const today = new Date()
    const year = format(today, 'yyyy')
    const month = format(today, 'MM')
    const day = format(today, 'dd')

    const result = validateIfDateInFuture({ year, month, day })
    expect(result).to.equal('Enter a date in the future')
  })

  it('should handle invalid inputs gracefully', () => {
    const invalidMessage = 'Enter a date in the future'

    expect(validateIfDateInFuture({})).to.equal(invalidMessage)
    expect(validateIfDateInFuture({ year: '2025' })).to.equal(invalidMessage)
    expect(validateIfDateInFuture({ year: '2025', month: '13' })).to.equal(
      invalidMessage
    )
  })
})
