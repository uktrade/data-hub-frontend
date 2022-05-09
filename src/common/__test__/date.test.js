const {
  parseDateString,
  formatStartAndEndDate,
} = require('../../client/utils/date')

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

  describe('#formatStartAndEndDate', () => {
    it('should format if there is only a start date', () => {
      expect(formatStartAndEndDate('2020-06-10T16:00:00Z', undefined)).to.equal(
        '10 Jun 2020'
      )
    })

    describe('when the end date is before the start date', () => {
      it('should return the start date', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-06-09T16:00:00Z')
        ).to.equal('10 Jun 2020')
      })
    })

    describe('when the end date same as start date', () => {
      it('should return the start date', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-06-10T16:00:00Z')
        ).to.equal('10 Jun 2020')
      })
    })
    //if start date is missing
    //if end date is exactly the same as the start date
    //if end date is on the same day but a different timestamp
    //if end date is after start date
    ////if end date is different month
    ////if end date is different year
    //how do timezones work? is it utc?
  })
})
