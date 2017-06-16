const toISOString = require('~/src/lib/date/toISOString')

describe('Date toISOString helper', () => {
  describe('#toISOString', () => {
    it('should return date part arguments as isoString', () => {
      const isoString = toISOString(1999, 3, 8)

      expect(isoString).to.equal('1999-04-08T11:00:00.000Z')
    })

    it('should return string date part arguments as isoString', () => {
      const isoString = toISOString('1999', '3', '8')

      expect(isoString).to.equal('1999-04-08T11:00:00.000Z')
    })

    it('should allow hours and minutes to be set', () => {
      const isoString = toISOString('1999', '3', '8', '10', '31')

      expect(isoString).to.equal('1999-04-08T09:31:00.000Z')
    })

    it('without args should set date to now', () => {
      const isoString = toISOString()

      expect(isoString).to.equal((new Date()).toISOString())
    })
  })
})
