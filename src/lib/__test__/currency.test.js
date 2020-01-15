const { convertUSDToGBP } = require(`../../common/currency`)
const { currencyRate } = require('../../config/index')

function getExpectedValue(value) {
  return Math.round(currencyRate.usdToGbp * value)
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
      expect(convertUSDToGBP(1)).to.equal(currencyRate.usdToGbp)
    })

    it('should convert $1M', () => {
      const expected = getExpectedValue(1000000)
      expect(convertUSDToGBP(1000000)).to.equal(expected)
    })
  })
})
