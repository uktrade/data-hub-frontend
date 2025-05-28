import { parseLocaleNumber, shortNumber } from '../number-utils'

describe('parseLocaleNumber', () => {
  context('when called with an empty value', () => {
    it('should return the same value', () => {
      expect(parseLocaleNumber('')).to.be.equal('')
    })
  })

  context('when called with an invalid number', () => {
    it('should return the same value', () => {
      expect(parseLocaleNumber('123abc')).to.be.NaN
    })
  })

  context('when called with a formatted number', () => {
    it('should return the value with formatting removed', () => {
      expect(parseLocaleNumber('100,00,559,6')).to.be.equal(100005596)
    })
  })
})

describe('shortNumber', () => {
  context('When called', () => {
    it('should format numbers', () => {
      expect(shortNumber(1234)).to.be.equal('1.23K')
      expect(shortNumber(12566)).to.be.equal('12.56K')
      expect(shortNumber(987534)).to.be.equal('987.53K')
      expect(shortNumber(8567876)).to.be.equal('8.56M')
      expect(shortNumber(9868567876)).to.be.equal('9.86B')
    })
  })

  context('When called without a number or string with characters', () => {
    it('should return null', () => {
      expect(shortNumber('not a number')).to.be.equal(null)
      expect(shortNumber({ not: 'a number' })).to.be.equal(null)
    })
  })

  context('When called with formatAfter', () => {
    it('should not format if formatAfter larger than given number', () => {
      expect(shortNumber(12500, 13000)).to.be.equal(12500)
    })

    it('should format if formatAfter smaller than given number', () => {
      expect(shortNumber(13123, 12500)).to.be.equal('13.12K')
    })
  })
})
