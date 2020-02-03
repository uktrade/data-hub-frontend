const { convertUSDToGBP } = require('../currency')
const { CURRENCY_RATE_USD_TO_GBP } = require('../constants')

function getExpectedValue(value) {
  return Math.round(CURRENCY_RATE_USD_TO_GBP * value)
}

describe('Currency test', () => {
  describe('USD to GBP', () => {
    it('should handle null', () => {
      expect(convertUSDToGBP(null)).to.equal(null)
    })

    it('should handle undefined', () => {
      expect(convertUSDToGBP(undefined)).to.equal(undefined)
    })

    it('should handle NaN', () => {
      expect(convertUSDToGBP(NaN)).to.deep.equal(NaN)
    })

    it('should convert zero', () => {
      expect(convertUSDToGBP(0)).to.equal(0)
    })

    it('should convert negative values -$100', () => {
      const expected = getExpectedValue(-100)
      expect(convertUSDToGBP(-100)).to.equal(expected)
    })

    it('should convert $1', () => {
      expect(convertUSDToGBP(1)).to.equal(CURRENCY_RATE_USD_TO_GBP)
    })

    it('should convert $1M', () => {
      const expected = getExpectedValue(1000000)
      expect(convertUSDToGBP(1000000)).to.equal(expected)
    })
  })
})
