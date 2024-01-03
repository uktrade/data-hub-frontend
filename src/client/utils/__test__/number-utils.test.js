import { parseLocaleNumber } from '../number-utils'

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
