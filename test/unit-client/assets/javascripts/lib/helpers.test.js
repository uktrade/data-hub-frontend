const {
  matchWords,
  checkDateFormat,
} = require('../../../../../assets/javascripts/lib/helpers')

describe('#matchWords', () => {
  const data = 'Aberdeen city -'

  it('should match one letter', () => {
    expect(matchWords(data, 'b')).to.equal(true)
  })

  it('should match one word', () => {
    expect(matchWords(data, 'Aberdeen')).to.equal(true)
  })

  it('should match two words', () => {
    expect(matchWords(data, 'Aberdeen city')).to.equal(true)
  })

  it('should match lowercase', () => {
    expect(matchWords(data, 'aberdeen')).to.equal(true)
  })

  it('should match uppercase', () => {
    expect(matchWords(data, 'ABERDEEN')).to.equal(true)
  })

  it('should match uppercase and lowercase', () => {
    expect(matchWords(data, 'AbErDeEn cIty')).to.equal(true)
  })

  it('should match words in reverse order', () => {
    expect(matchWords(data, 'city Aberdeen')).to.equal(true)
  })

  it('should match words with a hyphen', () => {
    expect(matchWords(data, '-')).to.equal(true)
  })

  it('should return false if not found', () => {
    expect(matchWords(data, 'z')).to.equal(false)
  })
})

describe('#checkDateFormat', () => {
  context('when the date matches the required date format', () => {
    it('should return true', () => {
      expect(checkDateFormat('01/01/2019')).to.equal(true)
    })
  })

  context('when the date does not match the required date format', () => {
    it('should return false', () => {
      expect(checkDateFormat('01')).to.equal(false)
      expect(checkDateFormat('01/')).to.equal(false)
      expect(checkDateFormat('01/01')).to.equal(false)
      expect(checkDateFormat('01/01/20')).to.equal(false)
      expect(checkDateFormat('aa/aa/aa')).to.equal(false)
      expect(checkDateFormat('2019/01/01')).to.equal(false)
    })
  })
})
