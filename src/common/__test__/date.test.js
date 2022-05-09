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

    describe('when the end date is same date and time as start date', () => {
      it('should return the start date', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-06-10T16:00:00Z')
        ).to.equal('10 Jun 2020')
      })
    })

    describe('when the end date is same day but different time as start date', () => {
      it('should return the start date', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-06-10T19:00:00Z')
        ).to.equal('10 Jun 2020')
      })
    })

    describe('when both dates are missing', () => {
      it('should return null', () => {
        expect(formatStartAndEndDate(null, null)).to.be.null
      })
    })

    describe('when start date is missing', () => {
      it('should return null', () => {
        expect(formatStartAndEndDate(null, '2020-06-10T16:00:00Z')).to.be.null
      })
    })

    describe('when the end date is after start date', () => {
      it('should return start and end date format with same month', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-06-15T19:00:00Z')
        ).to.equal('10 to 15 Jun 2020')
      })
      it('should return start and end date format with different month', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2020-07-10T19:00:00Z')
        ).to.equal('10 Jun 2020 to 10 Jul 2020')
      })
      it('should return start and end date format with different year', () => {
        expect(
          formatStartAndEndDate('2020-06-10T16:00:00Z', '2021-10-10T19:00:00Z')
        ).to.equal('10 Jun 2020 to 10 Oct 2021')
      })
    })

    //if end date is exactly the same as the start date
    //if end date is on the same day but a different timestamp
    //if end date is after start date
    ////if end date is different month
    ////if end date is different year
    //how do timezones work? is it utc?
  })
})
