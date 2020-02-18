const { convertUsdToGbp } = require('../currency')
const { EXCHANGE_RATE_USD_TO_GBP } = require('../constants')

function getExpectedValue(usd) {
  return usd * EXCHANGE_RATE_USD_TO_GBP
}

describe('Currency test', () => {
  describe('USD to GBP', () => {
    it('should handle null', () => {
      expect(convertUsdToGbp(null)).to.equal(null)
    })

    it('should handle undefined', () => {
      expect(convertUsdToGbp(undefined)).to.equal(undefined)
    })

    it('should handle NaN', () => {
      expect(convertUsdToGbp(NaN)).to.deep.equal(NaN)
    })

    it('should convert zero', () => {
      expect(convertUsdToGbp(0)).to.equal(0)
    })

    it('should convert negative values -$100', () => {
      const expected = getExpectedValue(-100)
      expect(convertUsdToGbp(-100)).to.equal(expected)
    })

    it('should convert $1', () => {
      expect(convertUsdToGbp(1)).to.equal(EXCHANGE_RATE_USD_TO_GBP)
    })

    it('should convert $1M', () => {
      const expected = getExpectedValue(1000000)
      expect(convertUsdToGbp(1000000)).to.equal(expected)
    })
  })
})
