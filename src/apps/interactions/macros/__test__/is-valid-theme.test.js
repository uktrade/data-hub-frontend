const { THEMES } = require('../../constants')
const isValidTheme = require('../is-valid-theme')

function testTheme (assertion) {
  return (theme) => expect(isValidTheme(theme)).to.equal(assertion)
}

describe('isValidTheme macro', () => {
  context('with a valid theme', () => {
    it('returns true', () => {
      Object.values(THEMES).forEach(testTheme(true))
    })
  })

  context('with invalid themes', () => {
    it('returns false', () => {
      [
        'foo',
        'bar',
      ].forEach(testTheme(false))
    })
  })
})
