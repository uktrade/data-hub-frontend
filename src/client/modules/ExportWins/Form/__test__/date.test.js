import { addDays, subMonths, subDays, startOfMonth, isEqual } from 'date-fns'

import {
  getRandomDateInRange,
  isWithinLastTwelveMonths,
  getStartDateOfTwelveMonthsAgo,
} from '../date'

describe('getStartDateOfTwelveMonthsAgo', () => {
  it(
    'should return a date that is 12 months ago from the current ' +
      'date and includes the 1st of the month',
    () => {
      const today = new Date()
      const expectedDate = subMonths(startOfMonth(today), 12)
      const actualDate = getStartDateOfTwelveMonthsAgo()
      expect(actualDate).to.be.instanceOf(Date)
      expect(isEqual(actualDate, expectedDate)).to.equal(true)
    }
  )
})

describe('isWithinLastTwelveMonths', () => {
  const twelveMonthsAgo = getStartDateOfTwelveMonthsAgo()
  const twelveMonthsAgoAddOneDay = addDays(twelveMonthsAgo, 1)
  const twelveMonthsAgoSubOneDay = subDays(twelveMonthsAgo, 1)
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const yesterday = subDays(today, 1)

  it('should be valid for the 1st of the month twelve months ago', () => {
    expect(isWithinLastTwelveMonths(twelveMonthsAgo)).to.equal(true)
  })

  it('should be valid for the 2nd of the month twelve months ago', () => {
    expect(isWithinLastTwelveMonths(twelveMonthsAgoAddOneDay)).to.equal(true)
  })

  it('should be invalid one day before the 1st of the month, thirteen months ago', () => {
    expect(isWithinLastTwelveMonths(twelveMonthsAgoSubOneDay)).to.equal(false)
  })

  it('should be valid for today', () => {
    expect(isWithinLastTwelveMonths(today)).to.equal(true)
  })

  it('should be invalid for tomorrow', () => {
    expect(isWithinLastTwelveMonths(tomorrow)).to.equal(false)
  })

  it('should be valid for yesterday', () => {
    expect(isWithinLastTwelveMonths(yesterday)).to.equal(true)
  })
})

describe('getRandomDateInRange', () => {
  it('should return a random date within the specified range', () => {
    const startDate = new Date(2024, 0, 1) // January 1, 2024
    const endDate = new Date(2024, 0, 10) // January 10, 2024
    const randomDate = getRandomDateInRange(startDate, endDate)
    expect(randomDate).to.be.instanceOf(Date)
    expect(randomDate.getTime()).to.be.at.least(startDate.getTime())
    expect(randomDate.getTime()).to.be.at.most(endDate.getTime())
  })

  it('should throw an error if the start date and the end date are the same', () => {
    const startDate = new Date(2024, 0, 1)
    const endDate = new Date(2024, 0, 1)
    expect(() => getRandomDateInRange(startDate, endDate)).to.throw(
      'Start date and end date cannot be the same.'
    )
  })

  it('should throw error if the start date is greater than the end date', () => {
    const startDate = new Date(2024, 0, 10)
    const endDate = new Date(2024, 0, 1)
    expect(() => getRandomDateInRange(startDate, endDate)).to.throw(
      'Start date cannot be greater than end date.'
    )
  })
})
