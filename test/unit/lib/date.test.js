const { parseDateString } = require(`~/common/date`)

describe('Date tests', () => {
  describe('parse human dates', () => {
    it('should parse 10 Jan 2017', () => {
      const actual = parseDateString('10 Jan 2017')
      const expected = new Date(2017, 0, 10)
      expect(actual).to.deep.equal(expected)
    })
    it('should parse 10 January 2015', () => {
      const actual = parseDateString('10 January 2015')
      const expected = new Date(2015, 0, 10)
      expect(actual).to.deep.equal(expected)
    })
    it('should not parse fred smith', () => {
      const actual = parseDateString('Fred Smith')
      expect(actual).to.be.null
    })
  })
})
