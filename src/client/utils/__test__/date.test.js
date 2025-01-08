import { isValid, format } from 'date-fns'

import {
  isoStringToDateParts,
  parseDateWithYearMonth,
  formatDateWithYearMonth,
} from '../date'

describe('isoStringToDateParts', () => {
  it('should return correct date parts for a valid ISO string', () => {
    const result = isoStringToDateParts('2025-01-08T10:30:00Z')
    expect(result).to.deep.equal({ year: 2025, month: 1, day: 8 })
  })

  it('should return empty date parts for an invalid ISO string', () => {
    const result = isoStringToDateParts('invalid-date')
    expect(result).to.deep.equal({ year: '', month: '', day: '' })
  })

  it('should return empty date parts for an empty string', () => {
    const result = isoStringToDateParts('')
    expect(result).to.deep.equal({ year: '', month: '', day: '' })
  })

  it('should return empty date parts for null input', () => {
    const result = isoStringToDateParts(null)
    expect(result).to.deep.equal({ year: '', month: '', day: '' })
  })

  it('should return empty date parts for undefined input', () => {
    const result = isoStringToDateParts(undefined)
    expect(result).to.deep.equal({ year: '', month: '', day: '' })
  })

  it('should correctly handle valid ISO date strings without time component', () => {
    const result = isoStringToDateParts('2025-01-08')
    expect(result).to.deep.equal({ year: 2025, month: 1, day: 8 })
  })
})

describe('parseDateWithYearMonth', () => {
  it('should parse a valid full date (yyyy-MM-dd)', () => {
    const date = parseDateWithYearMonth('2024', '12', '31')
    expect(isValid(date)).to.be.true
    expect(format(date, 'yyyy-MM-dd')).to.equal('2024-12-31')
  })

  it('should parse a valid year and month (yyyy-MM)', () => {
    const date = parseDateWithYearMonth('2024', '12')
    expect(isValid(date)).to.be.true
    expect(format(date, 'yyyy-MM')).to.equal('2024-12')
  })

  it('should handle invalid year (non-numeric)', () => {
    const date = parseDateWithYearMonth('abcd', '12', '31')
    expect(isValid(date)).to.be.false
  })

  it('should handle invalid month (out of range)', () => {
    const date = parseDateWithYearMonth('2024', '13', '31')
    expect(isValid(date)).to.be.false
  })

  it('should handle invalid day (out of range)', () => {
    const date = parseDateWithYearMonth('2024', '12', '32')
    expect(isValid(date)).to.be.false
  })

  it('should handle missing day gracefully (assume first of month)', () => {
    const date = parseDateWithYearMonth('2024', '12')
    expect(isValid(date)).to.be.true
    expect(format(date, 'yyyy-MM-dd')).to.equal('2024-12-01')
  })

  it('should handle single-digit month and day', () => {
    const date = parseDateWithYearMonth('2024', '2', '9')
    expect(isValid(date)).to.be.true
    expect(format(date, 'yyyy-MM-dd')).to.equal('2024-02-09')
  })

  it('should handle valid leap year date', () => {
    const date = parseDateWithYearMonth('2024', '2', '29')
    expect(isValid(date)).to.be.true
    expect(format(date, 'yyyy-MM-dd')).to.equal('2024-02-29')
  })

  it('should handle invalid non-leap year date', () => {
    const date = parseDateWithYearMonth('2023', '2', '29')
    expect(isValid(date)).to.be.false
  })

  it('should handle missing month (invalid case)', () => {
    const date = parseDateWithYearMonth('2024', null, '31')
    expect(isValid(date)).to.be.false
  })

  it('should handle missing year (invalid case)', () => {
    const date = parseDateWithYearMonth(null, '12', '31')
    expect(isValid(date)).to.be.false
  })
})

describe('formatDateWithYearMonth', () => {
  it('should format a full date (year, month, day)', () => {
    const result = formatDateWithYearMonth({ year: 2025, month: 1, day: 6 })
    expect(result).to.equal('2025-01-06')
  })

  it('should format a date when only year and month are provided', () => {
    const result = formatDateWithYearMonth({ year: 2025, month: 11 })
    expect(result).to.equal('2025-11')
  })

  it('should handle single-digit months and days', () => {
    const result = formatDateWithYearMonth({ year: 2025, month: 4, day: 9 })
    expect(result).to.equal('2025-04-09')
  })

  it('should throw an error for invalid year', () => {
    expect(() =>
      formatDateWithYearMonth({ year: 'invalid', month: 1, day: 1 })
    ).to.throw()
  })

  it('should throw an error for invalid month', () => {
    expect(() =>
      formatDateWithYearMonth({ year: 2025, month: 13, day: 1 })
    ).to.throw()
  })

  it('should throw an error for invalid day', () => {
    expect(() =>
      formatDateWithYearMonth({ year: 2025, month: 2, day: 30 })
    ).to.throw()
  })

  it('should handle edge case: February 29 on a leap year', () => {
    const result = formatDateWithYearMonth({ year: 2024, month: 2, day: 29 })
    expect(result).to.equal('2024-02-29')
  })

  it('should throw an error for February 29 on a non-leap year', () => {
    expect(() =>
      formatDateWithYearMonth({ year: 2023, month: 2, day: 29 })
    ).to.throw()
  })
})
