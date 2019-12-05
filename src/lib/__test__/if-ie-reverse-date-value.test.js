const reverseDateIfIE = require('../if-ie-reverse-date-value')

describe('Reverse date', () => {
  it('should reverse date if the user agent is IE', () => {
    const date = '2018/02/01'
    const userAgent = {
      isIE: true,
    }
    expect(reverseDateIfIE(date, userAgent)).to.equal('01/02/2018')
  })
  it('should not reverse the date if the user agent is not IE', () => {
    const date = '2018/02/01'
    const userAgent = {
      isIE: false,
    }
    expect(reverseDateIfIE(date, userAgent)).to.equal('2018/02/01')
  })
})
